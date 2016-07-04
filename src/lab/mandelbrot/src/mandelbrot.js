import MandelbrotRenderer from './MandelbrotRenderer';
import RenderWorker from './RenderWorker';
import Canvas from './Canvas';

const hex2dec = (hex) => parseInt(hex, 16);

const parseHexColor = (string) => ([
  hex2dec(string.substr(1, 2)),
  hex2dec(string.substr(3, 2)),
  hex2dec(string.substr(5, 2)),
]);

const updateColors = () => {
  const rgbs = colors.map(color => color.disabled ? null : parseHexColor(color.value)).filter(rgb => rgb !== null);
  mandelbrotWorker.setColors(...rgbs);
  render();

};

const setColorSelectors = (colors) => {
  for (let i = 0; i < 7; i += 1) {
    if (colors[i]) {
      document.getElementById('colorEnable' + i).checked = true;
      document.getElementById('colorPicker' + i).value = colors[i];
      document.getElementById('colorPicker' + i).disabled = false;
    }
    else {
      document.getElementById('colorEnable' + i).checked = false;
      document.getElementById('colorPicker' + i).disabled = true;
    }

  }
  updateColors();
};

const colorChecks = Array.prototype.slice.call(document.querySelectorAll('input[id^="colorEnable"]'));

const colors = Array.prototype.slice.call(document.querySelectorAll('input[type="color"]'));


const checkChange = (event) => {event.target.nextSibling.disabled = !event.target.checked; updateColors()};
colorChecks.forEach((check) => (check.addEventListener('change', checkChange)))
window.uc = updateColors;

// color
var roygbiv = [
  [51, 0, 68],
  [34, 0, 102],
  [17, 51, 204],
  [51, 221, 0],
  [255, 218, 33],
  [255, 102, 34],
  [209, 0, 0]
];

const setVibgyor = () => {
  setColorSelectors([
    '#330044',
    '#220066',
    '#1133cc',
    '#33dd00',
    '#ffda21',
    '#ff6622',
    '#d10000',
  ]);
};

const setMidnight = () => {
  setColorSelectors(['#360033', '#0b8793']);
}

document.querySelector('a[href="#vibgyor"]').addEventListener('click', setVibgyor);
document.querySelector('a[href="#midnight"]').addEventListener('click', setMidnight);


// iterations
var low = new Canvas('low_iteration');
var med = new Canvas('med_iteration');
var high = new Canvas('high_iteration');
let size = low.size();

const lowWorker = new RenderWorker(size.width, size.height);
const medWorker = new RenderWorker(size.width, size.height);
const highWorker = new RenderWorker(size.width, size.height);
lowWorker.setColors(...roygbiv)
medWorker.setColors(...roygbiv)
highWorker.setColors(...roygbiv)
lowWorker.setRange(
  { min: -0.7514434440067275, max: -0.7511886455000608 },
  { min: 0.030444671455519778, max: 0.030590555322608327 }
);
medWorker.setRange(
  { min: -0.7514434440067275, max: -0.7511886455000608 },
  { min: 0.030444671455519778, max: 0.030590555322608327 }
);
highWorker.setRange(
  { min: -0.7514434440067275, max: -0.7511886455000608 },
  { min: 0.030444671455519778, max: 0.030590555322608327 }
);

lowWorker.render().then((imageData) => low.setImageData(imageData));

medWorker.setMaxIterations(255);
medWorker.render().then((imageData) => med.setImageData(imageData));
highWorker.setMaxIterations(1000);
highWorker.render().then((imageData) => high.setImageData(imageData));

// interactive
var canvas = new Canvas('canvas');
size = canvas.size();
const mandelbrotWorker = new RenderWorker(size.width, size.height);
mandelbrotWorker.setColors(...roygbiv);

function render() {
  document.getElementById('rendering').style.display = 'block';
  mandelbrotWorker.render().then((imageData) => {
    document.getElementById('rendering').style.display = 'none';


    const realRange = mandelbrotWorker.settings.setRange[0];
    const imaginaryRange = mandelbrotWorker.settings.setRange[1];
    document.getElementById('real_range').textContent = `${realRange.min}, ${realRange.max}`;
    document.getElementById('imaginary_range').textContent = `${imaginaryRange.min}, ${imaginaryRange.max}`;

    return canvas.setImageData(imageData);
  });
}

render();

var point1;
var point2;
var canvasEl = document.getElementById('canvas');
canvasEl.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    point1 = canvas.getCoordinates(event);
  }
});
canvasEl.addEventListener('contextmenu', (e) => e.preventDefault());

canvasEl.addEventListener('mousemove', (event) => {
  if (event.button === 0 && point1) {
    let p = canvas.getCoordinates(event);

    canvas.rect(
      Math.min(point1.x, p.x),
      Math.min(point1.y, p.y),
      Math.max(point1.x, p.x) - Math.min(point1.x, p.x),
      Math.max(point1.y, p.y) - Math.min(point1.y, p.y)
    );
  }

});

canvasEl.addEventListener('mouseup', (event) => {
  if (event.button === 0) {
    point2 = canvas.getCoordinates(event);
    mandelbrotWorker.setRangeFromCoordinates(point1, point2);
  }

  if (event.button >= 1) {
    mandelbrotWorker.setRange(
      { min: -2.5, max: 1 },
      { min: -1.25, max: 1.25 }
    );
  }

  render();
;
});

var radios = [].slice.call(document.querySelectorAll('input[name="iterations"]'));
radios.forEach((radioEl) => {
  radioEl.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      mandelbrotWorker.setMaxIterations(event.currentTarget.value);
      render();
    }
  });
});
