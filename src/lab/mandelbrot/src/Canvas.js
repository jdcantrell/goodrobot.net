class Canvas {
  constructor(id) {
    console.log('what');
    this.canvas = document.getElementById(id);

    this.canvas.style.width = this.canvas.width + 'px';
    this.canvas.style.height = this.canvas.height + 'px';
    if (window.devicePixelRatio !== 1) {
      this.canvas.width = this.canvas.width * window.devicePixelRatio;
      this.canvas.height = this.canvas.height * window.devicePixelRatio;
    }

    this.context = this.canvas.getContext('2d');
  }

  getCoordinates(event) {
    this.rect = this.canvas.getBoundingClientRect();
    var coordinates = {
      x: (event.clientX - this.rect.left) * window.devicePixelRatio,
      y: (event.clientY - this.rect.top) * window.devicePixelRatio
    };
    return coordinates;
  }

  setImageData(data) {
    var imageData = new ImageData(data, this.canvas.width , this.canvas.height);
    this.context.putImageData(imageData, 0, 0);
  }

  rect(x, y, width, height) {
    console.log('uh');
    this.context.putImageData(imageData, 0, 0);
    this.context.rect(x, y, width, height);
    ctx.strokeStyle="white";
    this.context.stroke();
  }

  size() {
    return {
      height: this.canvas.height,
      width: this.canvas.width
    };
  }

}

export default Canvas;
