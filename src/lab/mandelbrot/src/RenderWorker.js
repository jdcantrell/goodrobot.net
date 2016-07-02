let c = 0;
class RenderWorker {

  constructor(width = 750, height = 562) {
    this.promises = [];
    this.worker = new Worker('mandelbrot/build/mandelbrot_worker.js');
    this.worker.postMessage(['init', width, height]);

    this.maxIterations = 200;
    this.realRange = { min: -2.5, max: 1, span: 3.5 };
    this.imaginaryRange = { min: -1.25, max: 1.25, span: 2.5 };
    this.setColors([0, 5, 0], [0, 105, 255]);
  }

  setMaxIterations(iterations) {
    this.worker.postMessage(['set', 'setMaxIterations', [iterations]]);
  }

  setRangeFromCoordinates(point1, point2) {
    this.worker.postMessage(['set', 'setRangeFromCoordinates', [point1, point2]])
  }

  setRange(realRange, imaginaryRange) {
    this.worker.postMessage(['set', 'setRange', [realRange, imaginaryRange]])
  }

  setColors(...colors) {
    this.worker.postMessage(['set', 'setColors', colors]);
  }

  render() {
    let promise = new Promise((resolve, reject) => {
      this.worker.addEventListener('message',  (e) => {
        if (e.data[0] === 'render') {
          resolve(e.data[1]);
        }
      });
    });
    this.worker.postMessage(['render']);
    return promise;
  }
}

export default RenderWorker;
