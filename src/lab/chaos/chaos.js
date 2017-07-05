/* globals Canvas */

class Runner {
  constructor() {
    this.onTickFn = () => {};
  }

  run() {
    this.onTickFn();
    window.requestAnimationFrame(() => { this.run(); });
  }

  onTick(onTickFn) {
    this.onTickFn = onTickFn;
  }
}

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

const canvas = new Canvas('canvas', [46, 42, 49, 255]);
canvas.setViewport({
  x1: -1.1,
  x2: 1.1,
  y1: -1.1,
  y2: 1.1,
});
canvas.clear();

const midPoint = (p1, p2) => ({
  x: ((p1.x + p2.x) / 2),
  y: ((p1.y + p2.y) / 2)
});

const notAway = (n, maxIdx) => (idx, previousIdx) => {
  if (idx > previousIdx) {
    if (idx - previousIdx === (maxIdx - n)) {
      return false;
    }
    return !(idx - previousIdx === n);
  }
  if (previousIdx - idx === (maxIdx - n)) {
    return false;
  }
  return !(previousIdx - idx === n);
};


const notAntiClockwise = (n, maxIdx) => (idx, previousIdx) => {
  const dist = idx - previousIdx;
  return (dist !== n) && (dist !== (n - (maxIdx)));
};

const previousPoint = (n, rule) => (...indexes) => {
  return rule(indexes[0], indexes[n]);
};


for (let i = 0; i < points.length; i += 1) {
  canvas.setPoint(points[i].x, points[i].y, [255, 255, 0]);
}


// some nice colors
const ctable = [
  [216, 19, 127],
  [214, 84, 7],
  [220, 138, 14],
  [23, 173, 152],
  [20, 155, 218],
  [121, 106, 245],
  [187, 96, 234],
  [199, 32, 202],

];
const colors = idx => ctable[idx % ctable.length];

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
      const c = chaos(p, points, rules, midPoint, idx);
      p = c.xy;
      canvas.setPoint(p.x, p.y, colors(idx));
      idx = c.idx;
    }
  }
  canvas.flush();
});

runner.run();

