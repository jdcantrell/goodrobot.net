class Canvas {

  constructor(id='canvas') {
    this.canvas = document.getElementById(id);
    this.canvas.style.width = this.canvas.width + 'px';
    this.canvas.style.height = this.canvas.height + 'px';

    if (window.devicePixelRatio !== 1) {
      this.canvas.width = this.canvas.width * window.devicePixelRatio;
      this.canvas.height = this.canvas.height * window.devicePixelRatio;
    }

    //this.data = new Uint8ClampedArray(this.canvas.width * this.canvas.height * 4).fill(255);
    this.context = this.canvas.getContext('2d');
    this.buffer = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.data = new Uint8ClampedArray(this.canvas.width * this.canvas.height * 4).fill(255);
  }

  setViewport({ x1, x2, y1, y2 }) {
    this.viewport = { x1, x2, y1, y2 };
  }

  setPixel(x, y, [ r, g, b ]) {
    var offset = (y * this.canvas.width + x) * 4;
    this.data[offset] = r;
    this.data[offset + 1] = g;
    this.data[offset + 2] = b;
  }

  setPoint(x, y, rgb) {
    const px = Math.floor(((x - this.viewport.x1) * this.canvas.width) / (this.viewport.x2 - this.viewport.x1));
    const py = Math.floor(((y - this.viewport.y1) * this.canvas.height) / (this.viewport.y2 - this.viewport.y1));
    this.setPixel(px, py, rgb);
  }

  flush() {
    this.buffer.data.set(this.data);
    this.context.putImageData(this.buffer, 0, 0);
    //this.data = new Uint8ClampedArray(this.canvas.width * this.canvas.height * 4).fill(255);
  }

}

const mult = ([ a, b, c, d ], [ x, y ]) => [
  a*x + b*y,
  c*x + d*y
];

const add = ([ x, y ], [ tx, ty ]) => [ x + tx, y + ty ];

const ifs = (transforms) => (x, y) => {
  let prob = Math.floor(Math.random() * (100));
  return transforms.reduce((xy, { p, affine, translate }) => {
    if (!xy && p > prob) {
      return add(mult(affine, [ x, y ]), translate);
    }
    prob -= p;
    return xy;
  }, false);
};

const canvas = new Canvas();
canvas.setViewport({
  x1: -2.2,
  x2: 2.7,
  y1: 0,
  y2: 10
});

let iterations = 5000000;
function iterate(fn) {
  for (let i = 0; i < 10000; i++) {
    fn();
    iterations--;
  }
  canvas.flush();

  if (iterations > 0) {
    window.requestAnimationFrame(() => { iterate(fn) });
  }
}

const barnsley = ifs([
  {
    p: 1,
    affine: [ 0, 0, 0, 0.16 ],
    translate: [ 0, 0 ]
  },
  {
    p: 85,
    affine: [ 0.85, 0.04, -0.04, 0.85 ],
    translate: [ 0, 1.6 ]
  },
  {
    p: 7,
    affine: [ 0.2, -0.26, 0.23, 0.22 ],
    translate: [ 0, 1.6 ]
  },
  {
    p: 7,
    affine: [ -0.15, 0.28, 0.26, 0.24 ],
    translate: [ 0, 0.44 ]
  }
]);

canvas.setViewport({
  x1: 0,
  x2: 1,
  y1: 0,
  y2: 1
});
const sierpinski = ifs([
  {
    p: 33,
    affine: [ -0.25, 0.43301270189, -0.43301270189, -0.25 ],
    translate: [ 0.25, 0.43301270189 ]
  },
  {
    p: 34,
    affine: [ 0.5, 0, 0, 0.5 ],
    translate: [ 0.25, 0.43301270189 ]
  },
  {
    p: 33,
    affine: [ -0.25, -0.43301270189, 0.43301270189, -0.25 ],
    translate: [ 1, 0 ]
  },
]);

canvas.setViewport({
  x1: -0.1,
  x2: 1.1,
  y1: -0.3,
  y2: 1
});
const pentigre = ifs([
  {
    p:16,
    affine: [ 0.309, -0.225, 0.225, 0.309 ],
    translate: [ 0, 0 ]
  },
  {
    p:16,
    affine: [ -0.118, -0.363, 0.363, -0.118 ],
    translate: [ 0.309, 0.225 ]
  },
  {
    p:16,
    affine: [ 0.309, 0.225, -0.225, 0.309 ],
    translate: [ 0.191, 0.588 ]
  },
  {
    p:16,
    affine: [ -0.118, 0.363, -0.363, -0.118 ],
    translate: [ 0.5, 0.363 ]
  },
  {
    p:16,
    affine: [ 0.309, 0.225, -0.225, 0.309 ],
    translate: [ 0.382, 0 ]
  },
  {
    p:16,
    affine: [ 0.309, -0.225, 0.225, 0.309 ],
    translate: [ 0.691, -0.225 ]
  },
]);

let x = 0;
let y = 0;
iterate(() => {
  [x, y] = pentigre(x, y) || [ 0, 0 ];
  canvas.setPoint(x, y, [ 0, 105, 0 ]);
});
