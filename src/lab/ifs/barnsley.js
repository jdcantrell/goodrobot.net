class Canvas {

  constructor(id='canvas', clearColor=[255, 255, 255, 255]) {
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
    this.clearColor = clearColor;
    this.clear();
  }

  clear() {
    const [r, g, b, a] = this.clearColor;
    this.context.fillStyle=`rgba(${r}, ${g}, ${b}, ${a})`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
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
    const py = Math.floor(((y - this.viewport.y2) * this.canvas.height) / (this.viewport.y1 - this.viewport.y2)); //invert y-axis
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


