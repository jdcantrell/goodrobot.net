class CanvasBuffer {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4).fill(255);
  }

  setPixel(x, y, { r, g, b }) {
    const offset = (y * this.width + x) * 4;
    this.data[offset] = r;
    this.data[offset + 1] = g;
    this.data[offset + 2] = b;
  }

  getData() {
    return this.data;
  }
}

export default CanvasBuffer;
