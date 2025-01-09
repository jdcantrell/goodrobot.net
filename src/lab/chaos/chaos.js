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
    if (typeof baseIndex === "undefined") {
      return false;
    }

    return (
      invalidPoints
        .map((invalidPoint) => (invalidPoint + baseIndex) % totalPoints)
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
  let newPointIndex = Math.floor(Math.random() * points.length);
  previousPoints.unshift(idx);
  let i;
  for (i = 0; i < 100; i += 1) {
    if (!passesRule(points.length, rule, newPointIndex, ...previousPoints)) {
      newPointIndex = Math.floor(Math.random() * points.length);
    } else {
      break;
    }
  }

  if (i === 100) {
    console.log("Could not get next point.");
    return {
      ruleFailure: true,
      idx: currentPointIndex,
      xy: xy,
    };
  }
  if (previousPoints.length > 10) {
    previousPoints.pop();
  }

  return {
    idx: newPointIndex,
    xy: newXY,
  };
};

const generatePoints = (numPoints) => {
  const points = [];
  for (let i = 0; i < numPoints; i += 1) {
    points.push({
      x: Math.cos(i * ((Math.PI * 2) / numPoints)),
      y: Math.sin(i * ((Math.PI * 2) / numPoints)),
    });
  }
  return points;
};

const canvas = new Canvas("canvas", [...getBackgroundColor(), 255]);
canvas.setViewport({
  x1: -1.1,
  x2: 1.1,
  y1: -1.1,
  y2: 1.1,
});
canvas.clear();

// motion rule
const move = (distance) => (p1, p2) => ({
  x: (p1.x + p2.x) * distance,
  y: (p1.y + p2.y) * distance,
});

canvas.flush();

const runner = new Runner();
runner.run();

const render = (totalPoints, rule, motion) => {
  const points = generatePoints(totalPoints);

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
        const c = chaos(p, points, rule, motion, idx);
        if (c.ruleFailure) {
          i = 1000;
          iteration = 0;
          console.log("Cannot continue, rules are too restrictive");
        }
        p = c.xy;
        canvas.setPoint(p.x, p.y, getColor(idx));
        idx = c.idx;
      }
    }
    canvas.flush();
  });
};

render(10, [[0, 1, 2, 3, 5, 8]], move(0.5));
