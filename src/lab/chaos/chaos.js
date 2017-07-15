/* globals Canvas, Runner, getColor, getBackgroundColor */
/* exported chaos */

const passesRules = (rules, newIdx, ...indexes) => {
  if (newIdx === null) {
    return false;
  }

  return !rules.length || !rules.some(rule => !rule(newIdx, ...indexes));
};

const previousPoints = [];
const chaos = (xy, points, rules, motionRule, currentPointIndex = null) => {
  let idx = currentPointIndex;
  if (currentPointIndex === null) {
    idx = Math.floor(Math.random() * points.length);
  }

  const newXY = motionRule(points[idx], xy);
  let newPointIndex = null;
  previousPoints.unshift(idx);
  while (!passesRules(rules, newPointIndex, ...previousPoints)) {
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

const points = generatePoints(9);

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

// rules
const notAntiClockwise = (n, maxIdx) => (idx, previousIdx) => {
  const dist = idx - previousIdx;
  return (dist !== n) && (dist !== (n - (maxIdx)));
};

const previousPoint = (n, rule) => (...indexes) => rule(indexes[0], indexes[n]);

const generateRules = (rulesDescriptions, totalPoints) => rulesDescriptions.map(
  ({ points, previous }) => previousPoint(previous, notAntiClockwise(points, totalPoints - 1))
);

// rule solver
const validPoints = (rules, totalPoints, prevPoints) => {
  const passes = [];
  for (let i = 0; i < totalPoints; i += 1) {
    if (passesRules(rules, i, ...prevPoints)) {
      passes.push(i);
    }
  }
  return passes;
};

const ruleCtx = document.getElementById('ruleCanvas').getContext('2d');

const unit2pixel = (width, height, scale) => ({ x, y }) => [
  ((x + 1) * (width * scale * 0.5)) + (width * 0.5 * (1 - scale)),
  ((1 - y) * (height * scale * 0.5)) + (height * 0.5 * (1 - scale))
];

const drawValidPoints = (canvasCtx, rules, totalPoints, prevPoints) => {

  canvasCtx.fillStyle = `rgba(${getBackgroundColor().join(',')}, 255)`;
  canvasCtx.fillRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

  const polygonPoints = generatePoints(totalPoints);
  const getCoords = unit2pixel(canvasCtx.canvas.width, canvasCtx.canvas.height, 0.85);

  // draw polygon
  canvasCtx.beginPath();
  canvasCtx.moveTo(...getCoords(polygonPoints[0]));
  polygonPoints.forEach(xy => canvasCtx.lineTo(...getCoords(xy)));
  canvasCtx.lineTo(...getCoords(polygonPoints[0]))
  canvasCtx.strokeStyle = 'rgb(216, 19, 127)';
  canvasCtx.stroke();

  // draw previous points
  const m = move(1.025);
  const m2 = move(1.125);
  prevPoints.forEach((idx, i) => {
    const p = polygonPoints[idx];
    const t = idx * 2 * (Math.PI / totalPoints);
    canvasCtx.beginPath();
    canvasCtx.moveTo(...getCoords(m({ x: 0, y: 0 }, p)));
    canvasCtx.lineTo(...getCoords(m2({ x: 0, y: 0 }, { x: Math.cos(t + 0.05), y: Math.sin(t + 0.05) })));
    canvasCtx.lineTo(...getCoords(m2({ x: 0, y: 0 }, { x: Math.cos(t - 0.05), y: Math.sin(t - 0.05) })));
    canvasCtx.fillStyle = `rgb(${getColor(i).join(',')})`;
    canvasCtx.fill()
  });

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

  // draw valid points
  for (let i = 0; i < totalPoints; i += 1) {
    if (passesRules(rules, i, ...prevPoints)) {
      const t = i * 2 * (Math.PI / totalPoints);
      canvasCtx.beginPath();
      canvasCtx.arc(...getCoords({ x: Math.cos(t), y: Math.sin(t) }), 5, 0, 2 * Math.PI);
      canvasCtx.strokeStyle = 'rgb(70, 255, 92)';
      canvasCtx.stroke();
    }
  }
};


canvas.flush();
const rules = [
  previousPoint(1, notAntiClockwise(1, points.length)),
  previousPoint(1, notAntiClockwise(2, points.length)),
  previousPoint(1, notAntiClockwise(4, points.length)),
  previousPoint(1, notAntiClockwise(8, points.length)),
  previousPoint(2, notAntiClockwise(1, points.length)),
  previousPoint(2, notAntiClockwise(2, points.length)),
  previousPoint(2, notAntiClockwise(4, points.length)),
  previousPoint(2, notAntiClockwise(8, points.length)),
];
const runner = new Runner();

let iteration = 100000;
let p = { x: 0, y: 1 };
let idx = null;

runner.onTick(() => {
  if (iteration === 100000) {
    canvas.clear();
  }
  if (iteration > 0) {
    for (let i = 0; i < 1000; i += 1) {
      iteration -= 1;
      const c = chaos(p, points, rules, move(0.333), idx);
      p = c.xy;
      canvas.setPoint(p.x, p.y, getColor(idx));
      idx = c.idx;
    }
  }
  canvas.flush();
});

runner.run();

