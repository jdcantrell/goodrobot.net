import RenderWorker from "./RenderWorker.js";
import Canvas from "./Canvas.js";

const roygbiv = [
  [51, 0, 68],
  [34, 0, 102],
  [17, 51, 204],
  [51, 221, 0],
  [255, 218, 33],
  [255, 102, 34],
  [209, 0, 0],
];

// range examples
const range1 = new Canvas("range1");
const range2 = new Canvas("range2");
const range3 = new Canvas("range3");
let size = range1.size();
const worker = new RenderWorker(size.width, size.height);

worker.setColors(...roygbiv);
worker.setRange(
  { min: 0.13096293834092881, max: 0.16214871611870657 },
  { min: -0.6711807290350156, max: -0.6401923296986343 },
);

worker
  .render()
  .then((imageData) => {
    range1.setImageData(imageData);
  })
  .then(() => {
    worker.setRange(
      { min: -0.7751481726752387, max: -0.7404592837863497 },
      { min: -0.10915617500098689, max: -0.08216500214350032 },
    );
    return worker.render();
  })
  .then((imageData) => {
    range2.setImageData(imageData);
  })
  .then(() => {
    worker.setRange(
      { min: -1.4610506914469399, max: -1.4097173581136067 },
      { min: -0.025164552047195587, max: 0.02489180488850684 },
    );
    return worker.render();
  })
  .then((imageData) => {
    range3.setImageData(imageData);
  });

// iteration examples
const low = new Canvas("low_iteration");
const med = new Canvas("med_iteration");
const high = new Canvas("high_iteration");
size = low.size();

const itWorker = new RenderWorker(size.width, size.height);
itWorker.setColors(...roygbiv);
itWorker.setRange(
  { min: -0.7514434440067275, max: -0.7511886455000608 },
  { min: 0.030444671455519778, max: 0.030590555322608327 },
);

itWorker
  .render()
  .then((imageData) => {
    low.setImageData(imageData);
  })
  .then(() => {
    itWorker.setMaxIterations(255);
    return itWorker.render();
  })
  .then((imageData) => {
    med.setImageData(imageData);
  })
  .then(() => {
    itWorker.setMaxIterations(1000);
    return itWorker.render();
  })
  .then((imageData) => {
    high.setImageData(imageData);
  });

//color examples
const colors1 = new Canvas("colors1");
const colors2 = new Canvas("colors2");
const colors3 = new Canvas("colors3");
size = colors1.size();
const cWorker = new RenderWorker(size.width, size.height);

cWorker.setColors(...roygbiv);
cWorker.setRange(
  { min: -1.0751111348470053, max: -0.8557778015136719 },
  { min: -0.3913107631045304, max: -0.20002962431449478 },
);

cWorker
  .render()
  .then((imageData) => {
    colors1.setImageData(imageData);
  })
  .then(() => {
    cWorker.setColors([0, 5, 0], [0, 255, 0], [18, 42, 69]);
    return cWorker.render();
  })
  .then((imageData) => {
    colors2.setImageData(imageData);
  })
  .then(() => {
    cWorker.setColors([0, 0, 0], [255, 255, 255]);
    return cWorker.render();
  })
  .then((imageData) => {
    colors3.setImageData(imageData);
  });

// interactive
const setVibgyor = () => {
  setColorSelectors([
    "#330044",
    "#220066",
    "#1133cc",
    "#33dd00",
    "#ffda21",
    "#ff6622",
    "#d10000",
  ]);
};

const setMidnight = () => {
  setColorSelectors(["#360033", "#0b8793"]);
};

const setFireZebra = () => {
  setColorSelectors([
    "#c21500",
    "#ffc500",
    "#c21500",
    "#ffc500",
    "#c21500",
    "#ffc500",
  ]);
};

document
  .querySelector('a[href="#vibgyor"]')
  .addEventListener("click", setVibgyor);
document
  .querySelector('a[href="#midnight"]')
  .addEventListener("click", setMidnight);
document
  .querySelector('a[href="#firezebra"]')
  .addEventListener("click", setFireZebra);

const hex2dec = (hex) => Number.parseInt(hex, 16);

const parseHexColor = (string) => [
  hex2dec(string.substr(1, 2)),
  hex2dec(string.substr(3, 2)),
  hex2dec(string.substr(5, 2)),
];

const colors = Array.prototype.slice.call(
  document.querySelectorAll('input[type="color"]'),
);

const updateColors = () => {
  const rgbs = colors
    .map((color) => (color.disabled ? null : parseHexColor(color.value)))
    .filter((rgb) => rgb !== null);
  mandelbrotWorker.setColors(...rgbs);
  render();
};
colors.forEach((input) => input.addEventListener("change", updateColors));

const setColorSelectors = (colors) => {
  for (let i = 0; i < 7; i += 1) {
    if (colors[i]) {
      document.getElementById(`colorEnable${i}`).checked = true;
      document.getElementById(`colorPicker${i}`).value = colors[i];
      document.getElementById(`colorPicker${i}`).disabled = false;
    } else {
      document.getElementById(`colorEnable${i}`).checked = false;
      document.getElementById(`colorPicker${i}`).disabled = true;
    }
  }
  updateColors();
};

const colorChecks = Array.prototype.slice.call(
  document.querySelectorAll('input[id^="colorEnable"]'),
);

const checkChange = (event) => {
  event.target.nextSibling.disabled = !event.target.checked;
  updateColors();
};
colorChecks.forEach((check) => check.addEventListener("change", checkChange));

const canvas = new Canvas("canvas");
size = canvas.size();
const mandelbrotWorker = new RenderWorker(size.width, size.height);
mandelbrotWorker.setColors(...roygbiv);

function render() {
  document.getElementById("rendering").style.display = "block";
  mandelbrotWorker.render().then((imageData) => {
    document.getElementById("rendering").style.display = "none";

    canvas.setImageData(imageData);

    const realRange = mandelbrotWorker.settings.setRange[0];
    const imaginaryRange = mandelbrotWorker.settings.setRange[1];
    document.getElementById("range").innerHTML =
      `(${realRange.min} + ${imaginaryRange.min}<em>i</em>) to (${realRange.max} + ${imaginaryRange.max}<em>i</em>)`;
  });
}

render();

let point1;
let point2;
const canvasEl = document.getElementById("canvas");
canvasEl.addEventListener("mousedown", (event) => {
  if (event.button === 0) {
    point1 = canvas.getCoordinates(event);
  }
});
canvasEl.addEventListener("contextmenu", (e) => e.preventDefault());

canvasEl.addEventListener("mousemove", (event) => {
  if (event.buttons === 1 && point1) {
    const p = canvas.getCoordinates(event);

    canvas.rect(
      Math.min(point1.x, p.x),
      Math.min(point1.y, p.y),
      Math.max(point1.x, p.x) - Math.min(point1.x, p.x),
      Math.max(point1.y, p.y) - Math.min(point1.y, p.y),
    );
  }
});

canvasEl.addEventListener("mouseup", (event) => {
  if (event.button === 0) {
    point2 = canvas.getCoordinates(event);
    mandelbrotWorker.setRangeFromCoordinates(point1, point2);
  }

  if (event.button >= 1) {
    mandelbrotWorker.setRange({ min: -2.5, max: 1 }, { min: -1.25, max: 1.25 });
  }

  render();
});

const radios = [].slice.call(
  document.querySelectorAll('input[name="iterations"]'),
);
radios.forEach((radioEl) => {
  radioEl.addEventListener("change", (event) => {
    if (event.currentTarget.checked) {
      mandelbrotWorker.setMaxIterations(event.currentTarget.value);
      render();
    }
  });
});
