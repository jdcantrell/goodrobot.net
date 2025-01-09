/* globals Canvas, Runner, getColor, getBackgroundColor */
/* exported ifs, render */

// multiply 2x2 matrix with a 2x1 matrix
const mult = ([a, b, c, d], [x, y]) => [a * x + b * y, c * x + d * y];

// add two 2x1 matrices
const add = ([x, y], [tx, ty]) => [x + tx, y + ty];

const ifs = (transforms) => {
  // allow probability to be greater than 100 because it's a pain to
  // housekeep it in the ux
  const total = transforms.reduce((t, { p }) => t + p, 0);
  return (x, y) => {
    // pick a number to choose which transform we will do
    let prob = Math.floor(Math.random() * total);
    return transforms.reduce((xy, { p, transform, translate }, idx) => {
      // if we haven't already calculated our xy, and this is the
      // transform we've randomly choosen then calculate the new xy
      if (!xy && p > prob) {
        return {
          xy: add(mult(transform, [x, y]), translate),
          idx: idx,
        };
      }
      prob -= p;
      return xy;
    }, false);
  };
};

// See if our new ifs system has points outside the current viewport, if
// so then update the viewport and redraw.
const checkViewport = (canvas, points) => {
  let x1 = Number.MAX_VALUE;
  let x2 = Number.MIN_VALUE;
  let y1 = Number.MAX_VALUE;
  let y2 = Number.MIN_VALUE;
  points.forEach(({ xy }) => {
    x1 = Math.min(xy[0], x1);
    x2 = Math.max(xy[0], x2);
    y1 = Math.min(xy[1], y1);
    y2 = Math.max(xy[1], y2);
  });

  x1 = Math.floor(x1 * 10) / 10;
  x2 = Math.ceil(x2 * 10) / 10;
  y1 = Math.floor(y1 * 10) / 10;
  y2 = Math.ceil(y2 * 10) / 10;

  if (
    canvas.viewport.x1 !== x1 ||
    canvas.viewport.x2 !== x2 ||
    canvas.viewport.y1 !== y1 ||
    canvas.viewport.y2 !== y2
  ) {
    canvas.clear();
    canvas.setViewport({ x1, x2, y1, y2 });
    points.forEach(({ xy, idx }) => {
      canvas.setPoint(xy[0], xy[1], getColor(idx));
    });
    canvas.flush();
  }
};

const canvas = new Canvas("canvas", [...getBackgroundColor(), 255]);
const runner = new Runner();
runner.run();

const render = ({ viewport, ifs }) => {
  let x = 0;
  let y = 0;
  const points = [];
  let iterations = 500000;

  runner.onTick(() => {
    if (iterations === 500000) {
      // starting a new ifs system, so clear screen
      canvas.setViewport(viewport);
      canvas.clear();
    }
    if (iterations > 0) {
      // do a few iterations of the current ifs system
      for (let i = 0; i < 10000; i += 1) {
        const r = ifs(x, y) || { xy: [0, 0], idx: 0 };
        [x, y] = r.xy;
        points.push(r);
        canvas.setPoint(x, y, getColor(r.idx));
        iterations -= 1;
      }

      if (iterations <= 0) {
        // fix our viewport if needed, but only after we've completed
        // all ifs iterations
        checkViewport(canvas, points);
      }
      canvas.flush();
    }
  });
};
