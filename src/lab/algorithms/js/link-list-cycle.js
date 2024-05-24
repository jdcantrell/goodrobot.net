const width = 640;
const height = 480;
function setup() {
  var canvas = createCanvas(
    width,
    height,
    P2D,
    document.getElementById("sketch"),
  );
  background(255);
  canvas.style("max-width", "100vw");
  canvas.style("max-height", "calc(100vh - 180px)");
  canvas.style("height", "auto");
  canvas.style("width", "auto");
}

const circleXPoint = (total) => (idx) => {
  return width / 2 + Math.cos(((Math.PI * 2) / total) * idx) * 200;
};

const circleYPoint = (total) => (idx) => {
  return height / 2 + Math.sin(((Math.PI * 2) / total) * idx) * 200;
};

const drawCycle = (nodes, loopIdx, idx1, idx2) => {
  const getX = circleXPoint(nodes);
  const getY = circleYPoint(nodes);

  // draw lines
  let prevPoint;
  for (let i = 0; i < nodes; i++) {
    const x = getX(i);
    const y = getY(i);

    if (prevPoint !== undefined) {
      line(prevPoint.x, prevPoint.y, x, y);
    }
    prevPoint = { x, y };
  }

  // prevPoint is our last point, so let's draw it to our loop node
  noFill();
  curve(
    prevPoint.x * 1.2,
    prevPoint.y * 1.2,
    prevPoint.x,
    prevPoint.y,
    getX(loopIdx),
    getY(loopIdx),
    getX(loopIdx) * 1.2,
    getY(loopIdx) * 1.2,
  );

  // draw bubbles
  for (let i = 0; i < nodes; i++) {
    const x = getX(i);
    const y = getY(i);

    if (i == idx1 && i == idx2) {
      fill("purple");
    } else if (i == idx1) {
      fill("blue");
    } else if (i == idx2) {
      fill("green");
    } else {
      fill(255);
    }
    circle(x, y, 25);
  }
};

let idx1 = 0;
let idx2 = 1;
let loopIdx = 1;
let nodes = 4;
let animate = true;
let count = 1;
function keyPressed() {
  if (key == "+") {
    nodes += 1;
  }

  if (key == "-") {
    nodes -= 1;
  }
  if (nodes < 3) {
    nodes = 3;
  }

  if (key == "r") {
    count = 1;
    idx1 = 0;
    idx2 = 1;
  }

  if (keyCode === UP_ARROW) {
    loopIdx += 1;
    if (loopIdx == nodes - 1) {
      loopIdx = nodes - 2;
    }
  }
  if (keyCode === DOWN_ARROW) {
    loopIdx -= 1;

    if (loopIdx <= 0) {
      loopIdx = 0;
    }
  }

  if (keyCode === RIGHT_ARROW) {
    count += 1;
    idx1 += 1;
    idx2 += 2;
  }
  if (keyCode === LEFT_ARROW) {
    count -= 1;
    if (count < 1) {
      count = 1;
    }
    idx1 = count - 1;
    idx2 = count * 2 - 1;
  }

  if (idx1 >= nodes) {
    idx1 = loopIdx;
  }

  if (idx2 >= nodes) {
    idx2 = loopIdx + (idx2 % nodes);
  }
}

function draw() {
  background(255);
  strokeWeight(5);
  fill(0);
  textSize(12);
  text(`iterations: ${count}`, 6, 20);
  text(`nodes: ${nodes}`, 6, 60);
  text(`loop idx: ${loopIdx}`, 6, 50);
  fill("blue");
  text(`idx1: ${idx1}`, 6, 30);
  fill("green");
  text(`idx2: ${idx2}`, 6, 40);
  drawCycle(nodes, loopIdx, idx1, idx2);
}
