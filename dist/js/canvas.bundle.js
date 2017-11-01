/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Initial Setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
var mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2
};

var colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

var points = [];
var friction = .5;

// Event Listeners
addEventListener('mousemove', function (event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener('resize', function () {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	init();
});

addEventListener('click', function () {
	return init();
});

// Utility Functions
function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
	var xDist = x2 - x1;
	var yDist = y2 - y1;

	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

// Objects
function Object(x, y, radius, color) {
	var _this = this;

	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;

	this.update = function () {
		_this.draw();
	};

	this.draw = function () {
		c.beginPath();
		c.arc(_this.x, _this.y, _this.radius, 0, Math.PI * 2, false);
		c.fillStyle = _this.color;
		c.fill();
		c.closePath();
	};
}

function Point(x, y, dx, dy, radius, color, neighborPoint) {
	var _this2 = this;

	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.baseDx = dx;
	this.baseDy = dy;
	this.radius = radius;
	this.color = color;
	this.neighborPoint = neighborPoint;
	var randomPoint = void 0;

	this.update = function () {

		this.x += this.dx;
		this.y += this.dy;
		console.log(this.dx, this.baseDx);

		if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
			this.dx = -this.dx;
		}

		if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
			this.dy = -this.dy;
		} else if (this.radius > this.minRadius) {
			this.radius = Math.max(this.radius - 1, this.minRadius);
		}

		//interactivity
		if (mouse.x - this.x < 25 && mouse.x - this.x > -25 && mouse.y - this.y < 25 && mouse.y - this.y > -25) {
			var headingX = this.x - mouse.x;
			var headingY = this.y - mouse.y;

			console.log('heading:' + headingX + "," + headingY);

			this.dx = Math.min(headingX, 1);
			this.dy = Math.min(headingY, 1);
		} else if (this.radius > 3) {
			this.radius = Math.max(this.radius - 1, this.minRadius);
		}
		this.draw();
	};

	this.draw = function () {
		c.beginPath();
		c.arc(_this2.x, _this2.y, _this2.radius, 0, Math.PI * 2, false);
		c.fillStyle = '#6B382D';
		c.fill();
		c.closePath();

		if (typeof neighborPoint != 'undefined') {
			c.beginPath();
			c.moveTo(_this2.x, _this2.y);
			c.lineTo(neighborPoint.x, neighborPoint.y);
			c.stroke();

			if (randomIntFromRange(-500, 50) > 0) {
				randomPoint = objects[randomIntFromRange(0, objects.length - 1)];
				c.lineTo(randomPoint.x, randomPoint.y);
				c.strokeStyle = 'rgba(42,107,83,.5)';
				c.stroke();
			}
			c.closePath();
		} else {
			c.beginPath();
			c.moveTo(_this2.x, _this2.y);
			c.strokeStyle = '#0C6B48';
			c.lineTo(objects[objects.length - 1].x, objects[objects.length - 1].y);
			c.stroke();
			c.closePath();
		}
	};
}

// Implementation
var objects = void 0;
function init() {
	objects = [];

	var lastPoint = void 0;

	for (var i = 0; i < 15; i++) {
		var radius = 3;
		var x = Math.random() * (canvas.width - radius * 2) + radius;
		var y = Math.random() * (canvas.height - radius * 2) + radius;
		var dx = randomIntFromRange(-4, 4);
		var dy = randomIntFromRange(-4, 4);

		objects.push(new Point(x, y, dx, dy, radius, 'red', lastPoint));
		lastPoint = objects[objects.length - 1];
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = '#1E1F1F';
	c.fillRect(0, 0, canvas.width, canvas.height);

	// c.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y);
	objects.map(function (obj) {
		return obj.update();
	});
}

init();
animate();

/***/ })
/******/ ]);
//# sourceMappingURL=canvas.bundle.js.map