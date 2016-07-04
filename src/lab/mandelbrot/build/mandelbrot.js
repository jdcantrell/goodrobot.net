/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _MandelbrotRenderer = __webpack_require__(1);

	var _MandelbrotRenderer2 = _interopRequireDefault(_MandelbrotRenderer);

	var _RenderWorker = __webpack_require__(3);

	var _RenderWorker2 = _interopRequireDefault(_RenderWorker);

	var _Canvas = __webpack_require__(4);

	var _Canvas2 = _interopRequireDefault(_Canvas);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var roygbiv = [[51, 0, 68], [34, 0, 102], [17, 51, 204], [51, 221, 0], [255, 218, 33], [255, 102, 34], [209, 0, 0]];

	// range examples
	var range1 = new _Canvas2.default('range1');
	var range2 = new _Canvas2.default('range2');
	var range3 = new _Canvas2.default('range3');
	var size = range1.size();
	var worker = new _RenderWorker2.default(size.width, size.height);

	worker.setColors.apply(worker, roygbiv);
	worker.setRange({ min: 0.13096293834092881, max: 0.16214871611870657 }, { min: -0.6711807290350156, max: -0.6401923296986343 });

	worker.render().then(function (imageData) {
	  range1.setImageData(imageData);
	}).then(function () {
	  worker.setRange({ min: -0.7751481726752387, max: -0.7404592837863497 }, { min: -0.10915617500098689, max: -0.08216500214350032 });
	  return worker.render();
	}).then(function (imageData) {
	  range2.setImageData(imageData);
	}).then(function () {
	  worker.setRange({ min: -1.4610506914469399, max: -1.4097173581136067 }, { min: -0.025164552047195587, max: 0.02489180488850684 });
	  return worker.render();
	}).then(function (imageData) {
	  range3.setImageData(imageData);
	});

	// iteration examples
	var low = new _Canvas2.default('low_iteration');
	var med = new _Canvas2.default('med_iteration');
	var high = new _Canvas2.default('high_iteration');
	size = low.size();

	var itWorker = new _RenderWorker2.default(size.width, size.height);
	itWorker.setColors.apply(itWorker, roygbiv);
	itWorker.setRange({ min: -0.7514434440067275, max: -0.7511886455000608 }, { min: 0.030444671455519778, max: 0.030590555322608327 });

	itWorker.render().then(function (imageData) {
	  low.setImageData(imageData);
	}).then(function () {
	  itWorker.setMaxIterations(255);
	  return itWorker.render();
	}).then(function (imageData) {
	  med.setImageData(imageData);
	}).then(function () {
	  itWorker.setMaxIterations(1000);
	  return itWorker.render();
	}).then(function (imageData) {
	  high.setImageData(imageData);
	});

	//color examples
	var colors1 = new _Canvas2.default('colors1');
	var colors2 = new _Canvas2.default('colors2');
	var colors3 = new _Canvas2.default('colors3');
	size = colors1.size();
	var cWorker = new _RenderWorker2.default(size.width, size.height);

	cWorker.setColors.apply(cWorker, roygbiv);
	cWorker.setRange({ min: -1.0751111348470053, max: -0.8557778015136719 }, { min: -0.3913107631045304, max: -0.20002962431449478 });

	cWorker.render().then(function (imageData) {
	  colors1.setImageData(imageData);
	}).then(function () {
	  cWorker.setColors([0, 5, 0], [0, 255, 0], [18, 42, 69]);
	  return cWorker.render();
	}).then(function (imageData) {
	  colors2.setImageData(imageData);
	}).then(function () {
	  cWorker.setColors([0, 0, 0], [255, 255, 255]);
	  return cWorker.render();
	}).then(function (imageData) {
	  colors3.setImageData(imageData);
	});

	// interactive
	var setVibgyor = function setVibgyor() {
	  setColorSelectors(['#330044', '#220066', '#1133cc', '#33dd00', '#ffda21', '#ff6622', '#d10000']);
	};

	var setMidnight = function setMidnight() {
	  setColorSelectors(['#360033', '#0b8793']);
	};

	var setFireZebra = function setFireZebra() {
	  setColorSelectors(['#c21500', '#ffc500', '#c21500', '#ffc500', '#c21500', '#ffc500']);
	};

	document.querySelector('a[href="#vibgyor"]').addEventListener('click', setVibgyor);
	document.querySelector('a[href="#midnight"]').addEventListener('click', setMidnight);
	document.querySelector('a[href="#firezebra"]').addEventListener('click', setFireZebra);

	var hex2dec = function hex2dec(hex) {
	  return parseInt(hex, 16);
	};

	var parseHexColor = function parseHexColor(string) {
	  return [hex2dec(string.substr(1, 2)), hex2dec(string.substr(3, 2)), hex2dec(string.substr(5, 2))];
	};

	var colors = Array.prototype.slice.call(document.querySelectorAll('input[type="color"]'));

	var updateColors = function updateColors() {
	  var rgbs = colors.map(function (color) {
	    return color.disabled ? null : parseHexColor(color.value);
	  }).filter(function (rgb) {
	    return rgb !== null;
	  });
	  mandelbrotWorker.setColors.apply(mandelbrotWorker, _toConsumableArray(rgbs));
	  render();
	};
	colors.forEach(function (input) {
	  return input.addEventListener('change', updateColors);
	});

	var setColorSelectors = function setColorSelectors(colors) {
	  for (var i = 0; i < 7; i += 1) {
	    if (colors[i]) {
	      document.getElementById('colorEnable' + i).checked = true;
	      document.getElementById('colorPicker' + i).value = colors[i];
	      document.getElementById('colorPicker' + i).disabled = false;
	    } else {
	      document.getElementById('colorEnable' + i).checked = false;
	      document.getElementById('colorPicker' + i).disabled = true;
	    }
	  }
	  updateColors();
	};

	var colorChecks = Array.prototype.slice.call(document.querySelectorAll('input[id^="colorEnable"]'));

	var checkChange = function checkChange(event) {
	  event.target.nextSibling.disabled = !event.target.checked;updateColors();
	};
	colorChecks.forEach(function (check) {
	  return check.addEventListener('change', checkChange);
	});

	var canvas = new _Canvas2.default('canvas');
	size = canvas.size();
	var mandelbrotWorker = new _RenderWorker2.default(size.width, size.height);
	mandelbrotWorker.setColors.apply(mandelbrotWorker, roygbiv);

	function render() {
	  document.getElementById('rendering').style.display = 'block';
	  mandelbrotWorker.render().then(function (imageData) {
	    document.getElementById('rendering').style.display = 'none';

	    canvas.setImageData(imageData);

	    var realRange = mandelbrotWorker.settings.setRange[0];
	    var imaginaryRange = mandelbrotWorker.settings.setRange[1];
	    document.getElementById('range').innerHTML = '(' + realRange.min + ' + ' + imaginaryRange.min + '<em>i</em>) to (' + realRange.max + ' + ' + imaginaryRange.max + '<em>i</em>)';
	  });
	}

	render();

	var point1;
	var point2;
	var canvasEl = document.getElementById('canvas');
	canvasEl.addEventListener('mousedown', function (event) {
	  if (event.button === 0) {
	    point1 = canvas.getCoordinates(event);
	  }
	});
	canvasEl.addEventListener('contextmenu', function (e) {
	  return e.preventDefault();
	});

	canvasEl.addEventListener('mousemove', function (event) {
	  if (event.buttons === 1 && point1) {
	    var p = canvas.getCoordinates(event);

	    canvas.rect(Math.min(point1.x, p.x), Math.min(point1.y, p.y), Math.max(point1.x, p.x) - Math.min(point1.x, p.x), Math.max(point1.y, p.y) - Math.min(point1.y, p.y));
	  }
	});

	canvasEl.addEventListener('mouseup', function (event) {
	  if (event.button === 0) {
	    point2 = canvas.getCoordinates(event);
	    mandelbrotWorker.setRangeFromCoordinates(point1, point2);
	  }

	  if (event.button >= 1) {
	    mandelbrotWorker.setRange({ min: -2.5, max: 1 }, { min: -1.25, max: 1.25 });
	  }

	  render();
	  ;
	});

	var radios = [].slice.call(document.querySelectorAll('input[name="iterations"]'));
	radios.forEach(function (radioEl) {
	  radioEl.addEventListener('change', function (event) {
	    if (event.currentTarget.checked) {
	      mandelbrotWorker.setMaxIterations(event.currentTarget.value);
	      render();
	    }
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _CanvasBuffer = __webpack_require__(2);

	var _CanvasBuffer2 = _interopRequireDefault(_CanvasBuffer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MandelbrotRenderer = function () {
	  function MandelbrotRenderer() {
	    var width = arguments.length <= 0 || arguments[0] === undefined ? 750 : arguments[0];
	    var height = arguments.length <= 1 || arguments[1] === undefined ? 562 : arguments[1];

	    _classCallCheck(this, MandelbrotRenderer);

	    this.buffer = new _CanvasBuffer2.default({ width: width, height: height });
	    this.maxIterations = 200;
	    this.realRange = { min: -2.5, max: 1, span: 3.5 };
	    this.imaginaryRange = { min: -1.25, max: 1.25, span: 2.5 };
	    this.setColors([0, 5, 0], [0, 105, 255]);
	  }

	  _createClass(MandelbrotRenderer, [{
	    key: 'setMaxIterations',
	    value: function setMaxIterations(iterations) {
	      this.maxIterations = iterations;
	      this.setColors.apply(this, _toConsumableArray(this.colors));
	    }
	  }, {
	    key: 'setRange',
	    value: function setRange(realRange, imaginaryRange) {
	      this.realRange = realRange;
	      this.imaginaryRange = imaginaryRange;
	      this.realRange.span = realRange.max - realRange.min;
	      this.imaginaryRange.span = imaginaryRange.max - imaginaryRange.min;
	    }
	  }, {
	    key: 'setColors',
	    value: function setColors() {
	      for (var _len = arguments.length, colors = Array(_len), _key = 0; _key < _len; _key++) {
	        colors[_key] = arguments[_key];
	      }

	      this.colors = colors;
	      this.palette = [];
	      for (var i = 0; i < this.maxIterations; i += 1) {
	        this.palette.push(this._getRgb(this.maxIterations, i, colors));
	      }
	    }
	  }, {
	    key: '_getRgb',
	    value: function _getRgb(maxIterations, iteration, colors) {
	      var maxIndex = colors.length - 1;
	      var v = iteration / maxIterations * maxIndex;
	      var i1 = parseInt(v, 0);
	      var i2 = Math.min(i1 + 1, maxIndex);

	      var r1 = colors[i1][0];
	      var g1 = colors[i1][1];
	      var b1 = colors[i1][2];

	      var r2 = colors[i2][0];
	      var g2 = colors[i2][1];
	      var b2 = colors[i2][2];

	      var f = v - i1;
	      return {
	        r: r1 + f * (r2 - r1),
	        g: g1 + f * (g2 - g1),
	        b: b1 + f * (b2 - b1)
	      };
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      for (var x = 0; x < this.buffer.width; x += 1) {
	        var cReal = x / this.buffer.width * this.realRange.span + this.realRange.min;
	        for (var y = 0; y < this.buffer.height; y += 1) {
	          var cImaginary = y / this.buffer.height * this.imaginaryRange.span + this.imaginaryRange.min;
	          var zReal = 0;
	          var zImaginary = 0;
	          var iteration = 0;
	          while (zReal * zReal + zImaginary * zImaginary < 4 && iteration < this.maxIterations) {
	            var zRealTemp = zReal * zReal - zImaginary * zImaginary + cReal;
	            zImaginary = 2 * zReal * zImaginary + cImaginary;
	            zReal = zRealTemp;
	            iteration += 1;
	          }
	          this.buffer.setPixel(x, y, this.palette[iteration - 1]);
	        }
	      }
	      return this.buffer.getData();
	    }
	  }]);

	  return MandelbrotRenderer;
	}();

	exports.default = MandelbrotRenderer;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CanvasBuffer = function () {
	  function CanvasBuffer(_ref) {
	    var width = _ref.width;
	    var height = _ref.height;

	    _classCallCheck(this, CanvasBuffer);

	    this.width = width;
	    this.height = height;
	    this.data = new Uint8ClampedArray(width * height * 4).fill(255);
	  }

	  _createClass(CanvasBuffer, [{
	    key: "setPixel",
	    value: function setPixel(x, y, _ref2) {
	      var r = _ref2.r;
	      var g = _ref2.g;
	      var b = _ref2.b;

	      var offset = (y * this.width + x) * 4;
	      this.data[offset] = r;
	      this.data[offset + 1] = g;
	      this.data[offset + 2] = b;
	    }
	  }, {
	    key: "getData",
	    value: function getData() {
	      return this.data;
	    }
	  }]);

	  return CanvasBuffer;
	}();

	exports.default = CanvasBuffer;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var RenderWorker = function () {
	  function RenderWorker() {
	    var width = arguments.length <= 0 || arguments[0] === undefined ? 750 : arguments[0];
	    var height = arguments.length <= 1 || arguments[1] === undefined ? 562 : arguments[1];

	    _classCallCheck(this, RenderWorker);

	    this.width = width;
	    this.height = height;
	    this.settings = {
	      setMaxIterations: [200],
	      setRange: [{ min: -2.5, max: 1, span: 3.5 }, { min: -1.25, max: 1.25, span: 2.5 }],
	      setColors: [[0, 5, 0], [0, 105, 255]]
	    };
	  }

	  _createClass(RenderWorker, [{
	    key: 'setMaxIterations',
	    value: function setMaxIterations(iterations) {
	      this.settings.setMaxIterations = [iterations];
	    }
	  }, {
	    key: 'setRangeFromCoordinates',
	    value: function setRangeFromCoordinates(point1, point2) {
	      if (point1.x === point2.x || point1.y === point2.y) {
	        return;
	      }
	      var realRange = this.settings.setRange[0];
	      var imaginaryRange = this.settings.setRange[1];
	      this.setRange({
	        min: Math.min(point1.x, point2.x) / this.width * realRange.span + realRange.min,
	        max: Math.max(point1.x, point2.x) / this.width * realRange.span + realRange.min
	      }, {
	        min: Math.min(point1.y, point2.y) / this.height * imaginaryRange.span + imaginaryRange.min,
	        max: Math.max(point1.y, point2.y) / this.height * imaginaryRange.span + imaginaryRange.min
	      });
	    }
	  }, {
	    key: 'setRange',
	    value: function setRange(realRange, imaginaryRange) {
	      this.settings.setRange = [realRange, imaginaryRange];
	    }
	  }, {
	    key: 'setColors',
	    value: function setColors() {
	      for (var _len = arguments.length, colors = Array(_len), _key = 0; _key < _len; _key++) {
	        colors[_key] = arguments[_key];
	      }

	      this.settings.setColors = colors;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this = this;

	      if (this.worker) {
	        this.worker.terminate();
	      }
	      this.worker = new Worker('mandelbrot/build/mandelbrot_worker.js');
	      this.worker.postMessage(['init', this.width, this.height]);
	      var promise = new Promise(function (resolve, reject) {
	        _this.worker.addEventListener('message', function (e) {
	          if (e.data[0] === 'render') {
	            if (e.data[1].length) {
	              resolve(e.data[1]);
	              _this.settings.setRange = e.data[2];
	            } else {
	              reject();
	            }

	            _this.worker.terminate();
	          }
	        });
	      });
	      this.worker.postMessage(['render', this.settings]);
	      return promise;
	    }
	  }]);

	  return RenderWorker;
	}();

	exports.default = RenderWorker;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Canvas = function () {
	  function Canvas(id) {
	    _classCallCheck(this, Canvas);

	    this.canvas = document.getElementById(id);

	    this.canvas.style.width = this.canvas.width + 'px';
	    this.canvas.style.height = this.canvas.height + 'px';
	    if (window.devicePixelRatio !== 1) {
	      this.canvas.width = this.canvas.width * window.devicePixelRatio;
	      this.canvas.height = this.canvas.height * window.devicePixelRatio;
	    }

	    this.context = this.canvas.getContext('2d');
	  }

	  _createClass(Canvas, [{
	    key: 'getCoordinates',
	    value: function getCoordinates(event) {
	      this.boundingRect = this.canvas.getBoundingClientRect();
	      var coordinates = {
	        x: (event.clientX - this.boundingRect.left) * window.devicePixelRatio,
	        y: (event.clientY - this.boundingRect.top) * window.devicePixelRatio
	      };
	      return coordinates;
	    }
	  }, {
	    key: 'setImageData',
	    value: function setImageData(data) {
	      var imageData = new ImageData(data, this.canvas.width, this.canvas.height);
	      this.imageData = imageData;
	      this.context.putImageData(imageData, 0, 0);
	    }
	  }, {
	    key: 'rect',
	    value: function rect(x, y, width, height) {
	      var _this = this;

	      window.requestAnimationFrame(function () {
	        _this.context.putImageData(_this.imageData, 0, 0);
	        _this.context.beginPath();
	        _this.context.rect(x, y, width, height);
	        _this.context.strokeStyle = "white";
	        _this.context.stroke();
	      });
	    }
	  }, {
	    key: 'size',
	    value: function size() {
	      return {
	        height: this.canvas.height,
	        width: this.canvas.width
	      };
	    }
	  }]);

	  return Canvas;
	}();

	exports.default = Canvas;

/***/ }
/******/ ]);