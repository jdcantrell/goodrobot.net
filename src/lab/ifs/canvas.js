class Canvas {

  constructor(id='canvas', clearColor=[255, 255, 255, 255]) {
    this.canvas = document.getElementById(id);
    this.calculateSize();

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

  calculateSize() {
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    if (window.devicePixelRatio !== 1) {
      this.canvas.width = this.canvas.width * window.devicePixelRatio;
      this.canvas.height = this.canvas.height * window.devicePixelRatio;
    }
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
  }

}
