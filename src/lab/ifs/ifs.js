const mult = ([ a, b, c, d ], [ x, y ]) => [
  a*x + b*y,
  c*x + d*y
];

const add = ([ x, y ], [ tx, ty ]) => [ x + tx, y + ty ];

const ifs = (transforms) => (x, y) => {
  let prob = Math.floor(Math.random() * (100));
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

const render = ({ viewport, ifs }) => {
  canvas.setViewport(viewport);
  let x = 0;
  let y = 0;
  iterations = 500000;
  clear = true;
  renderFn = () => {
    let r = ifs(x, y) || { xy: [0, 0], idx: 0 };
    [x, y]= r.xy;
    canvas.setPoint(x, y, colors(r.idx));
  };
};


