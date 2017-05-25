const mult = ([ a, b, c, d ], [ x, y ]) => [
  a*x + b*y,
  c*x + d*y
];

const add = ([ x, y ], [ tx, ty ]) => [ x + tx, y + ty ];

const ifs = (transforms) => (x, y) => {
  let prob = Math.floor(Math.random() * (100));
  return transforms.reduce((xy, { p, transform, translate }) => {
    if (!xy && p > prob) {
      return add(mult(transform, [ x, y ]), translate);
    }
    prob -= p;
    return xy;
  }, false);
};

const canvas = new Canvas('canvas', [ 255, 255, 238, 255 ]);

function iterate(fn) {
  let iterations = 500000;
  const _batch = () => {
    for (let i = 0; i < 10000; i++) {
      fn();
      iterations--;
    }
    canvas.flush();

    if (iterations > 0) {
      window.requestAnimationFrame(() => { _batch() });
    }
  }
  _batch();
}

const render = ({ viewport, ifs }) => {
  canvas.clear();
  canvas.setViewport(viewport);
  let x = 0;
  let y = 0;
  iterate(() => {
    [x, y] = ifs(x, y) || [ 0, 0 ];
    canvas.setPoint(x, y, [ 24, 105, 57 ]);
  });
};


