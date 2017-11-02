/* globals Canvas, Runner, getColor, getBackgroundColor */
/* exported chaos */

const passesRule = (totalPoints, rule, newIndex, ...indexes) => {
  if (newIndex === null) {
    return false;
  }

  if (indexes[0] === null) {
    return true;
  }

  const fails = rule.some((invalidPoints, idx) => {
    const baseIndex = indexes[idx];
    if (typeof baseIndex === 'undefined') {
      return false;
    }

    return (
      invalidPoints
        .map(invalidPoint => (invalidPoint + baseIndex) % totalPoints)
        .indexOf(newIndex) !== -1
    );

  });


  return !fails;
};

let previousPoints = [];
const chaos = (xy, points, rule, motionRule, currentPointIndex = null) => {
  let idx = currentPointIndex;
  if (currentPointIndex === null) {
    previousPoints = [];
    idx = Math.floor(Math.random() * points.length);
  }

  const newXY = motionRule(points[idx], xy);
  let newPointIndex = null;
  previousPoints.unshift(idx);
  while (!passesRule(points.length, rule, newPointIndex, ...previousPoints)) {
    newPointIndex = Math.floor(Math.random() * points.length);
  }
  if (previousPoints.length > 10) {
    previousPoints.pop();
  }

  return {
    idx: newPointIndex,
    xy: newXY
  };

};

const generatePoints = numPoints => {
  const points = [];
  for (let i = 0; i < numPoints; i += 1) {
    points.push({
      x: Math.cos(i * ((Math.PI * 2) / numPoints)),
      y: Math.sin(i * ((Math.PI * 2) / numPoints))
    });
  }
  return points;
};


const canvas = new Canvas('canvas', [...getBackgroundColor(), 255]);
canvas.setViewport({
  x1: -1.1,
  x2: 1.1,
  y1: -1.1,
  y2: 1.1,
});
canvas.clear();

// motion rule
const move = distance => (p1, p2) => ({
  x: ((p1.x + p2.x) * distance),
  y: ((p1.y + p2.y) * distance)
});

const ruleCtx = document.getElementById('ruleCanvas').getContext('2d');

const unit2pixel = (width, height, scale) => ({ x, y }) => [
  ((x + 1) * (width * scale * 0.5)) + (width * 0.5 * (1 - scale)),
  ((1 - y) * (height * scale * 0.5)) + (height * 0.5 * (1 - scale))
];

const drawValidPoints = (canvasCtx, rules, totalPoints, prevPoints) => {

  canvasCtx.fillStyle = `rgba(${getBackgroundColor().join(',')}, 255)`; // eslint-disable-line
  canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

  const polygonPoints = generatePoints(totalPoints);
  const getCoords = unit2pixel(canvasCtx.canvas.width, canvasCtx.canvas.height, 0.85);

  // draw polygon
  canvasCtx.beginPath();
  canvasCtx.moveTo(...getCoords(polygonPoints[0]));
  polygonPoints.forEach(xy => canvasCtx.lineTo(...getCoords(xy)));
  canvasCtx.lineTo(...getCoords(polygonPoints[0]));
  canvasCtx.strokeStyle = 'rgb(216, 19, 127)'; // eslint-disable-line
  canvasCtx.stroke();

  // draw previous points
  let cPoint = { x: 0, y: 1 };
  let cIdx = null;
  prevPoints.reverse().forEach(i => {
    const m = move(1.025 + (0.025 * i));
    const m2 = move(1.125 + (0.025 * i));

    // pick random next point
    const c = chaos(cPoint, polygonPoints, rules, move(0.333), cIdx);
    cPoint = c.xy;
    cIdx = c.idx;
    const p = polygonPoints[cIdx];

    const t = cIdx * 2 * (Math.PI / totalPoints);
    canvasCtx.beginPath();
    canvasCtx.moveTo(...getCoords(m({ x: 0, y: 0 }, p)));
    canvasCtx.lineTo(...getCoords(m2({ x: 0, y: 0 }, { x: Math.cos(t + 0.05), y: Math.sin(t + 0.05) })));
    canvasCtx.lineTo(...getCoords(m2({ x: 0, y: 0 }, { x: Math.cos(t - 0.05), y: Math.sin(t - 0.05) })));
    canvasCtx.fillStyle = `rgb(${getColor(i).join(',')})`; // eslint-disable-line
    canvasCtx.fill();
  });

  // handle current point
  const m = move(1.025);
  const m2 = move(1.125);

  // pick random next point
  const c = chaos(cPoint, polygonPoints, rules, move(0.333), cIdx);
  cPoint = c.xy;
  cIdx = c.idx;
  const p = polygonPoints[cIdx];

  const t = cIdx * 2 * (Math.PI / totalPoints);
  canvasCtx.beginPath();
  canvasCtx.moveTo(...getCoords(m({ x: 0, y: 0 }, p)));
  canvasCtx.lineTo(...getCoords(m2({ x: 0, y: 0 }, { x: Math.cos(t + 0.05), y: Math.sin(t + 0.05) })));
  canvasCtx.lineTo(...getCoords(m2({ x: 0, y: 0 }, { x: Math.cos(t - 0.05), y: Math.sin(t - 0.05) })));
  canvasCtx.fillStyle = `rgb(${getColor(0).join(',')})`; // eslint-disable-line
  canvasCtx.fill();

  // put points back in order
  prevPoints.reverse();

  // fill in legend
  const legend = document.getElementById('ruleLegend');
  legend.innerHTML = '';
  const labels = ['Current', '1st previous', '2nd previous', '3rd previous', '4th previous', '5th previous', '6th previous', '7th previous', '8th previous', '9th previous', '10th previous'];
  const lis = [];
  for (let i = 0; i < prevPoints.length; i += 1) {
    lis.push(`<li style="color:rgb(${getColor(i).join(',')})">&#9658; ${labels[i]} point</li>`);
  }
  lis.push('<li style="color:rgb(70, 255, 92)">Valid next point</li>');
  legend.innerHTML = `<ul>${lis.join('')}</ul>`;

  for (let i = 0; i < totalPoints; i += 1) {
    if (passesRule(rules, i, ...prevPoints)) {
      const t = i * 2 * (Math.PI / totalPoints);
      canvasCtx.beginPath();
      canvasCtx.arc(...getCoords({ x: Math.cos(t), y: Math.sin(t) }), 5, 0, 2 * Math.PI);
      canvasCtx.strokeStyle = 'rgb(70, 255, 92)'; // eslint-disable-line
      canvasCtx.stroke();
    }
  }
};


canvas.flush();

const vRules = (totalPoints, rule, prevPoints = []) => {
  if (prevPoints.length !== rule.length + 1) {
    let pass = false;
    for (let i = 0; i < totalPoints; i += 1) {
      if (passesRule(totalPoints, rule, i, ...prevPoints)) {
        pass = pass || vRules(totalPoints, rule, [i, ...prevPoints]);
      }
    }
    return pass;
  }
  return passesRule(totalPoints, rule, ...prevPoints);
};


const runner = new Runner();
runner.run();

const render = (totalPoints, rule, motion) => {
  const points = generatePoints(totalPoints);

  let iteration = 100000;
  let p = { x: 0, y: 1 };
  let idx = null;

  if (vRules(points.length, rule)) {
    runner.onTick(() => {
      if (iteration === 100000) {
        canvas.clear();
      }
      if (iteration > 0) {
        for (let i = 0; i < 1000; i += 1) {
          iteration -= 1;
          const c = chaos(p, points, rule, motion, idx);
          p = c.xy;
          canvas.setPoint(p.x, p.y, getColor(idx));
          if (idx === null) {
            console.log('int point', c.idx);
          }
          idx = c.idx;
        }
      }
      canvas.flush();
    });

  } else {
    console.log('Rules are too restrictive.');
  }
};

render(10,
 [
   [0, 1, 2, 3, 5, 8],
   [1, 3, 5, 7, 9]
 ],
 move(0.5)
);
