class RenderWorker {
  constructor(width = 750, height = 562) {
    this.width = width;
    this.height = height;
    this.settings = {
      setMaxIterations: [200],
      setRange: [
        { min: -2.5, max: 1, span: 3.5 },
        { min: -1.25, max: 1.25, span: 2.5 },
      ],
      setColors: [
        [0, 5, 0],
        [0, 105, 255],
      ],
    };
  }

  setMaxIterations(iterations) {
    this.settings.setMaxIterations = [iterations];
  }

  setRangeFromCoordinates(point1, point2) {
    if (point1.x === point2.x || point1.y === point2.y) {
      return;
    }
    const realRange = this.settings.setRange[0];
    const imaginaryRange = this.settings.setRange[1];
    this.setRange(
      {
        min:
          (Math.min(point1.x, point2.x) / this.width) * realRange.span +
          realRange.min,
        max:
          (Math.max(point1.x, point2.x) / this.width) * realRange.span +
          realRange.min,
      },
      {
        min:
          (Math.min(point1.y, point2.y) / this.height) * imaginaryRange.span +
          imaginaryRange.min,
        max:
          (Math.max(point1.y, point2.y) / this.height) * imaginaryRange.span +
          imaginaryRange.min,
      },
    );
  }

  setRange(realRange, imaginaryRange) {
    this.settings.setRange = [realRange, imaginaryRange];
  }

  setColors(...colors) {
    this.settings.setColors = colors;
  }

  render() {
    if (this.worker) {
      this.worker.terminate();
    }
    this.worker = new Worker("build/mandelbrot_worker.js");
    this.worker.postMessage(["init", this.width, this.height]);
    const promise = new Promise((resolve, reject) => {
      this.worker.addEventListener("message", (e) => {
        if (e.data[0] === "render") {
          if (e.data[1].length) {
            resolve(e.data[1]);
            this.settings.setRange = e.data[2];
          } else {
            reject();
          }

          this.worker.terminate();
        }
      });
    });
    this.worker.postMessage(["render", this.settings]);
    return promise;
  }
}

export default RenderWorker;
