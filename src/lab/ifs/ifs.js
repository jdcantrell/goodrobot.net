const mult = ([ a, b, c, d ], [ x, y ]) => [
  a*x + b*y,
  c*x + d*y
];

const add = ([ x, y ], [ tx, ty ]) => [ x + tx, y + ty ];

const ifs = (transforms) => (x, y) => {
  const total = transforms.reduce((t, { p }, idx) => {
    return t += p
  } , 0);
  let prob = Math.floor(Math.random() * (total));
  return transforms.reduce((xy, { p, transform, translate }, idx) => {
    if (!xy && p > prob) {
      return {
        xy: add(mult(transform, [ x, y ]), translate),
        idx: idx
      };
    }
    prob -= p;
    return xy;
  }, false);
};

const canvas = new Canvas('canvas', [ 46, 42, 49, 255 ]);
const emptyFn = () => {}
let renderFn = emptyFn
let iterations = 0;
let clear = false;

const checkViewport = () => {
  let x1 = 1000000, x2 = -10000000, y1 = 100000000, y2 = -10000000;
  points.forEach(({ xy, idx }) => {
    x1 = Math.min(xy[0], x1);
    x2 = Math.max(xy[0], x2);
    y1 = Math.min(xy[1], y1);
    y2 = Math.max(xy[1], y2);
  });

  x1 = (Math.floor(x1 * 10) / 10);
  x2 = (Math.ceil(x2 * 10) / 10);
  y1 = (Math.floor(y1 * 10) / 10);
  y2 = (Math.ceil(y2 * 10) / 10);

  if (canvas.viewport.x1 !== x1
    || canvas.viewport.x2 !== x2
    || canvas.viewport.y1 !== y1
    || canvas.viewport.y2 !== y2) {

    console.log('Updating viewport', { x1, x2, y1, y2 });

    canvas.clear();
    canvas.setViewport({ x1, x2, y1, y2 });
    points.forEach(({ xy, idx }) => {
      canvas.setPoint(xy[0], xy[1], colors(idx));
    })
    canvas.flush();
  }


}

function iterate() {
  if (clear) {
    canvas.clear();
    clear = false;
  }
  if (iterations > 0) {
    for (let i = 0; i < 10000; i++) {
      renderFn();
      iterations--;
    }
    canvas.flush();

    if (iterations <= 0) {
      checkViewport();
    }
  }
  window.requestAnimationFrame(iterate);
}

iterate();

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
const colors = (idx) => {
  return ctable[idx % ctable.length];
}

let points = [];

const render = ({ viewport, ifs }) => {
  canvas.setViewport(viewport);
  let x = 0;
  let y = 0;
  points = [];
  iterations = 50000;
  clear = true;
  renderFn = () => {
    let r = ifs(x, y) || { xy: [0, 0], idx: 0 };
    [x, y]= r.xy;
    points.push(r);
    canvas.setPoint(x, y, colors(r.idx));
  };
};
