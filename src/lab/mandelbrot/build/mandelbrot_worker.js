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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var renderer = void 0;

	self.addEventListener('message', function (message) {
	  console.log(message);
	  var action = message.data[0];
	  console.log(action);

	  (function () {
	    switch (action) {
	      case 'init':
	        renderer = new _MandelbrotRenderer2.default(message.data[1], message.data[2]);
	        self.postMessage(['init']);
	        break;
	      case 'render':
	        var settings = message.data[1];
	        Object.keys(settings).forEach(function (method) {
	          if (settings[method] !== null) {
	            var _renderer$method;

	            (_renderer$method = renderer[method]).call.apply(_renderer$method, [renderer].concat(_toConsumableArray(settings[method])));
	          }
	        });
	        var imageData = renderer.render();
	        self.postMessage(['render', imageData, [renderer.realRange, renderer.imaginaryRange]]);
	        break;
	    }
	  })();
	}, false);

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

/***/ }
/******/ ]);