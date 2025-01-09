class Canvas {
  constructor(id) {
    this.canvas = document.getElementById(id);

    this.canvas.style.width = `${this.canvas.width}px`;
    this.canvas.style.height = `${this.canvas.height}px`;
    if (window.devicePixelRatio !== 1) {
      this.canvas.width = this.canvas.width * window.devicePixelRatio;
      this.canvas.height = this.canvas.height * window.devicePixelRatio;
    }

    this.context = this.canvas.getContext("2d");
  }

  getCoordinates(event) {
    this.boundingRect = this.canvas.getBoundingClientRect();
    return {
      x: (event.clientX - this.boundingRect.left) * window.devicePixelRatio,
      y: (event.clientY - this.boundingRect.top) * window.devicePixelRatio,
    };
  }

  setImageData(data) {
    const imageData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    imageData.data.set(data);
    this.imageData = imageData;
    this.context.putImageData(imageData, 0, 0);
  }

  rect(x, y, width, height) {
    window.requestAnimationFrame(() => {
      this.context.putImageData(this.imageData, 0, 0);
      this.context.beginPath();
      this.context.rect(x, y, width, height);
      this.context.strokeStyle = "white";
      this.context.stroke();
    });
  }

  size() {
    return {
      height: this.canvas.height,
      width: this.canvas.width,
    };
  }
}

export default Canvas;
