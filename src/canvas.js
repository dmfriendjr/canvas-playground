// Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;


// Variables
const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2 
};

const colors = [
	'#2185C5',
	'#7ECEFD',
	'#FFF6E5',
	'#FF7F66'
];

let points = [];
let lines = [];
let friction = .5;
let now;
let delta;
let then;

// Event Listeners
addEventListener('mousemove', event => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener('resize', () => {
	canvas.width = innerWidth;	
	canvas.height = innerHeight;

	init();
});

addEventListener('click', () => init());


// Utility Functions
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

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


function ConnectingLine(point1,point2, color) {
	this.point1 = point1;
	this.point2 = point2;
	this.color = color;
	let alphaValue = 0;
	let frameLifetime = 10;
	let alphaLerp = 50;
	let isSpawning = true;
	let isDying = false;

	this.update = () => {

		this.draw();
		if (isSpawning === true){
			alphaValue += .05;
			if (alphaValue >= .4)
			{
				isSpawning = false;
			}
		}else {
			frameLifetime--;
		}

		if (alphaValue < 0 && isSpawning === false){
			let index = lines.indexOf(this);
			if (index > -1){
				lines.splice(index, 1);
			}	
		}
		else if (frameLifetime <= 0 && isDying === false){
			isDying = true;
		}
		else if (isDying === true){
			alphaValue -= .01;
		}
	};

	this.draw = () => {
		c.beginPath();
		c.moveTo(this.point1.x,this.point1.y)
		c.lineTo(this.point2.x,this.point2.y);
		c.strokeStyle = 'rgba(42,107,83,' + alphaValue + ')';
		c.stroke();
		c.closePath();
	};
}

function Point(x, y, dx, dy, radius, color, neighborPoint) {
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
	let randomPoint;
	let interactionFrameDelay = 0;

	this.update = function () {

			this.x += this.dx;
			this.y += this.dy;

			if (this.x + this.radius> canvas.width || this.x - this.radius < 0)
			{
				this.dx = -this.dx;
				// this.dx = Math.abs(this.dx) > this.baseDX ? -((this.dx * this.baseDx) / 2) : -this.dx; 
			}

			if (this.y + this.radius > canvas.height || this.y - this.radius < 0)
			{
				this.dy = -this.dy;
			}	

			//Interactivity
			if (mouse.x - this.x < 25 && mouse.x - this.x > -25 &&
				mouse.y - this.y < 25 && mouse.y - this.y > -25) {
				let headingX = this.x - mouse.x;
				let headingY = this.y - mouse.y;

				this.dx = headingX > 0 ? Math.max(Math.min(headingX,this.dx),this.dx) : Math.min(Math.max(headingX,-this.dx),-this.dx);
				this.dy = headingY > 0 ? Math.max(Math.min(headingY,this.dy),this.dy) : Math.min(Math.max(headingY,-this.dy),-this.dy);
				// this.dx = this.dx * Math.sign(headingX);
				// this.dy = this.dy * Math.sign(headingY);
				interactionFrameDelay = 0;
			}


		this.draw();
	}

	this.draw = () => {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
		c.fillStyle = '#6B382D';
		c.fill();
		c.closePath();

		if (typeof neighborPoint != 'undefined')
		{
			c.beginPath();
			c.moveTo(this.x,this.y);
			c.lineTo(neighborPoint.x,neighborPoint.y);
			c.stroke();
			c.closePath();
		}
		else {
			c.beginPath();
			c.moveTo(this.x,this.y);
			c.strokeStyle = '#0C6B48';
			c.lineTo(points[points.length-1].x,points[points.length-1].y);
			c.stroke();
			c.closePath();
		}
	}
}

// Implementation
function init() {
	points = [];
	lines = [];

	let lastPoint;

	c.font ="35px Monospace";

	for (let i = 0; i < 10; i++) {
		let radius = 3;
		let x = Math.random() * (canvas.width - (radius * 2)) + radius;
		let y = Math.random() * (canvas.height - (radius * 2)) + radius;
		let randomVelocity = getRandomVelocity();
		// let dx = randomIntFromRange(-4,4);
		// let dy = randomIntFromRange(-4,4);

		points.push(new Point(x,y,randomVelocity[0],randomVelocity[1],radius, 'red', lastPoint));
		lastPoint = points[points.length-1];
	}
}

function getRandomVelocity() {
	let dx = randomIntFromRange(-4,4);
	let dy = randomIntFromRange(-4,4);

	if (dx === 0 || dy === 0)
	{
		return getRandomVelocity();
	}
	else
	{
		return [dx,dy];
	}
}

function getTwoRandomPoints() {
	let point1 = points[randomIntFromRange(0,points.length-1)];
	let point2 = points[randomIntFromRange(0,points.length-1)];

	if (point1 != point2)
	{
		return [point1,point2];
	}
	else
	{
		return getTwoRandomPoints();
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	//Create canvas background color
	c.fillStyle = '#1E1F1F';
	c.fillRect(0,0,canvas.width,canvas.height);


	//Random chance to generate lines
	let chance = Math.random();
	if (chance > 0.8 && lines.length < 15)
	{
		let randomPoints = getTwoRandomPoints();
		lines.push(new ConnectingLine(randomPoints[0],randomPoints[1],'red'));
	}

	// c.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y);
	points.map(obj => obj.update());
	lines.map(obj => obj.update());

	//Draw text
	c.fillStyle="#0C6B48";
	c.textAlign = "center";
	c.fillText("Welcome",canvas.width/2,canvas.height/2);
	c.strokeStyle="#2A6B53";
	c.strokeText("I am David Friend, a Full-Stack Developer",canvas.width/2,canvas.height/2 + 45)
	// c.fillText("I am David Friend, a Full-Stack Developer",canvas.width/2,canvas.height/2 + 45);

}

init();
animate();