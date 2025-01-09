import CanvasBuffer from "./CanvasBuffer";

class MandelbrotRenderer {
  constructor(width = 750, height = 562) {
    this.buffer = new CanvasBuffer({ width: width, height: height });
    this.maxIterations = 200;
    this.realRange = { min: -2.5, max: 1, span: 3.5 };
    this.imaginaryRange = { min: -1.25, max: 1.25, span: 2.5 };
    this.setColors([0, 5, 0], [0, 105, 255]);
  }

  setMaxIterations(iterations) {
    this.maxIterations = iterations;
    this.setColors(...this.colors);
  }

  setRange(realRange, imaginaryRange) {
    this.realRange = realRange;
    this.imaginaryRange = imaginaryRange;
    this.realRange.span = realRange.max - realRange.min;
    this.imaginaryRange.span = imaginaryRange.max - imaginaryRange.min;
  }

  setColors(...colors) {
    this.colors = colors;
    this.palette = [];
    for (let i = 0; i < this.maxIterations; i += 1) {
      this.palette.push(this._getRgb(this.maxIterations, i, colors));
    }
  }

  _getRgb(maxIterations, iteration, colors) {
    const maxIndex = colors.length - 1;
    const v = (iteration / maxIterations) * maxIndex;
    const i1 = Number.parseInt(v, 0);
    const i2 = Math.min(i1 + 1, maxIndex);

    const r1 = colors[i1][0];
    const g1 = colors[i1][1];
    const b1 = colors[i1][2];

    const r2 = colors[i2][0];
    const g2 = colors[i2][1];
    const b2 = colors[i2][2];

    const f = v - i1;
    return {
      r: r1 + f * (r2 - r1),
      g: g1 + f * (g2 - g1),
      b: b1 + f * (b2 - b1),
    };
  }

  render() {
    for (let x = 0; x < this.buffer.width; x += 1) {
      const cReal =
        (x / this.buffer.width) * this.realRange.span + this.realRange.min;
      for (let y = 0; y < this.buffer.height; y += 1) {
        const cImaginary =
          (y / this.buffer.height) * this.imaginaryRange.span +
          this.imaginaryRange.min;
        let zReal = 0;
        let zImaginary = 0;
        let iteration = 0;
        while (
          zReal * zReal + zImaginary * zImaginary < 4 &&
          iteration < this.maxIterations
        ) {
          const zRealTemp = zReal * zReal - zImaginary * zImaginary + cReal;
          zImaginary = 2 * zReal * zImaginary + cImaginary;
          zReal = zRealTemp;
          iteration += 1;
        }
        this.buffer.setPixel(x, y, this.palette[iteration - 1]);
      }
    }
    return this.buffer.getData();
  }
}

export default MandelbrotRenderer;
