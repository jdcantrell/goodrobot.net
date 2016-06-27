class Canvas {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');
  }

  getCoordinates(event) {
    this.rect = this.canvas.getBoundingClientRect();
    var coordinates = {
      x: event.clientX - this.rect.left,
      y: event.clientY - this.rect.top
    };
    return coordinates;
  }

  setImageData(data) {
    var imageData = new ImageData(data, this.canvas.width, this.canvas.height);
    this.context.putImageData(imageData, 0, 0);
  }

  size() {
    return {
      height: this.canvas.height,
      width: this.canvas.width
    };
  }

}

export default Canvas;
