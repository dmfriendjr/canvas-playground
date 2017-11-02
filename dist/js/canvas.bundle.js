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
var lines = [];
var friction = .5;
var now = void 0;
var delta = void 0;
var then = void 0;

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

// points
// function Object(x, y, radius, color) {
// 	this.x = x;
// 	this.y = y;
// 	this.radius = radius;
// 	this.color = color;

// 	this.update = () => {
// 		this.draw();
// 	};

// 	this.draw = () => {
// 		c.beginPath();
// 		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
// 		c.fillStyle = this.color;
// 		c.fill();
// 		c.closePath();
// 	};
// }


function ConnectingLine(point1, point2, color) {
	var _this = this;

	this.point1 = point1;
	this.point2 = point2;
	this.color = color;
	var alphaValue = 0;
	var frameLifetime = 10;
	var alphaLerp = 50;
	var isSpawning = true;
	var isDying = false;

	this.update = function () {

		_this.draw();
		if (isSpawning === true) {
			alphaValue += .05;
			if (alphaValue >= .4) {
				isSpawning = false;
			}
		} else {
			frameLifetime--;
		}

		if (alphaValue < 0 && isSpawning === false) {
			var index = lines.indexOf(_this);
			if (index > -1) {
				lines.splice(index, 1);
			}
		} else if (frameLifetime <= 0 && isDying === false) {
			isDying = true;
		} else if (isDying === true) {
			alphaValue -= .01;
		}
	};

	this.draw = function () {
		c.beginPath();
		c.moveTo(_this.point1.x, _this.point1.y);
		c.lineTo(_this.point2.x, _this.point2.y);
		c.strokeStyle = 'rgba(42,107,83,' + alphaValue + ')';
		c.stroke();
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
	this.minRadius = 3;
	this.color = color;
	this.neighborPoint = neighborPoint;
	var randomPoint = void 0;
	var interactionFrameDelay = 0;

	this.update = function () {

		this.x += this.dx;
		this.y += this.dy;

		if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
			this.dx = -this.dx;
			// this.dx = Math.abs(this.dx) > this.baseDX ? -((this.dx * this.baseDx) / 2) : -this.dx; 
		}

		if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
			this.dy = -this.dy;
		}

		//Interactivity
		if (mouse.x - this.x < 25 && mouse.x - this.x > -25 && mouse.y - this.y < 25 && mouse.y - this.y > -25) {
			var headingX = this.x - mouse.x;
			var headingY = this.y - mouse.y;

			this.dx = headingX > 0 ? Math.max(Math.min(headingX, this.dx), this.dx) : Math.min(Math.max(headingX, -this.dx), -this.dx);
			this.dy = headingY > 0 ? Math.max(Math.min(headingY, this.dy), this.dy) : Math.min(Math.max(headingY, -this.dy), -this.dy);
			// this.dx = this.dx * Math.sign(headingX);
			// this.dy = this.dy * Math.sign(headingY);
			interactionFrameDelay = 0;
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
			c.closePath();
		} else {
			c.beginPath();
			c.moveTo(_this2.x, _this2.y);
			c.strokeStyle = '#0C6B48';
			c.lineTo(points[points.length - 1].x, points[points.length - 1].y);
			c.stroke();
			c.closePath();
		}
	};
}

// Implementation
function init() {
	points = [];
	lines = [];

	var lastPoint = void 0;

	c.font = "35px Monospace";

	for (var i = 0; i < 10; i++) {
		var radius = 3;
		var x = Math.random() * (canvas.width - radius * 2) + radius;
		var y = Math.random() * (canvas.height - radius * 2) + radius;
		var randomVelocity = getRandomVelocity();
		// let dx = randomIntFromRange(-4,4);
		// let dy = randomIntFromRange(-4,4);

		points.push(new Point(x, y, randomVelocity[0], randomVelocity[1], radius, 'red', lastPoint));
		lastPoint = points[points.length - 1];
	}
}

function getRandomVelocity() {
	var dx = randomIntFromRange(-4, 4);
	var dy = randomIntFromRange(-4, 4);

	if (dx === 0 || dy === 0) {
		return getRandomVelocity();
	} else {
		return [dx, dy];
	}
}

function getTwoRandomPoints() {
	var point1 = points[randomIntFromRange(0, points.length - 1)];
	var point2 = points[randomIntFromRange(0, points.length - 1)];

	if (point1 != point2) {
		return [point1, point2];
	} else {
		return getTwoRandomPoints();
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	//Create canvas background color
	c.fillStyle = '#1E1F1F';
	c.fillRect(0, 0, canvas.width, canvas.height);

	//Random chance to generate lines
	var chance = Math.random();
	if (chance > 0.8 && lines.length < 15) {
		var randomPoints = getTwoRandomPoints();
		lines.push(new ConnectingLine(randomPoints[0], randomPoints[1], 'red'));
	}

	// c.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y);
	points.map(function (obj) {
		return obj.update();
	});
	lines.map(function (obj) {
		return obj.update();
	});

	//Draw text
	c.fillStyle = "#0C6B48";
	c.textAlign = "center";
	c.fillText("Welcome", canvas.width / 2, canvas.height / 2);
	c.strokeStyle = "#2A6B53";
	c.strokeText("I am David Friend, a Full-Stack Developer", canvas.width / 2, canvas.height / 2 + 45);
	// c.fillText("I am David Friend, a Full-Stack Developer",canvas.width/2,canvas.height/2 + 45);
}

init();
animate();

/***/ })
/******/ ]);
//# sourceMappingURL=canvas.bundle.js.map