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
let friction = .5;


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


// Objects
function Object(x, y, radius, color) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;

	this.update = () => {
		this.draw();
	};

	this.draw = () => {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
		c.fillStyle = this.color;
		c.fill();
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
	this.color = color;
	this.neighborPoint = neighborPoint;
	let randomPoint;

	this.update = function () {

			this.x += this.dx;
			this.y += this.dy;
			console.log(this.dx, this.baseDx);

			if (this.x + this.radius> canvas.width || this.x - this.radius < 0)
			{
				this.dx = -this.dx;
			}

			if (this.y + this.radius > canvas.height || this.y - this.radius < 0)
			{
				this.dy = -this.dy;
			}	

			else if (this.radius > this.minRadius)
			{
				this.radius = Math.max(this.radius-1,this.minRadius);
			}

			//interactivity
			if (mouse.x - this.x < 25 && mouse.x - this.x > -25 &&
				mouse.y - this.y < 25 && mouse.y - this.y > -25) {
				let headingX = this.x - mouse.x;
				let headingY = this.y - mouse.y;

				console.log('heading:' + headingX + "," + headingY);

				this.dx = Math.min(headingX,1);
				this.dy = Math.min(headingY,1);
			}
			else if (this.radius > 3)
			{
				this.radius = Math.max(this.radius-1,this.minRadius);
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

			if(randomIntFromRange(-500,50) > 0)
			{
				randomPoint = objects[randomIntFromRange(0,objects.length-1)];
				c.lineTo(randomPoint.x,randomPoint.y);
				c.strokeStyle = 'rgba(42,107,83,.5)';
				c.stroke();
			}
			c.closePath();
		}
		else {
			c.beginPath();
			c.moveTo(this.x,this.y);
			c.strokeStyle = '#0C6B48';
			c.lineTo(objects[objects.length-1].x,objects[objects.length-1].y);
			c.stroke();
			c.closePath();
		}
	}
}

// Implementation
let objects;
function init() {
	objects = []

	let lastPoint;

	for (let i = 0; i < 15; i++) {
		let radius = 3;
		let x = Math.random() * (canvas.width - (radius * 2)) + radius;
		let y = Math.random() * (canvas.height - (radius * 2)) + radius;
		let dx = randomIntFromRange(-4,4);
		let dy = randomIntFromRange(-4,4);

		objects.push(new Point(x,y,dx,dy,radius, 'red', lastPoint));
		lastPoint = objects[objects.length-1];
	}
}


// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	c.fillStyle = '#1E1F1F';
	c.fillRect(0,0,canvas.width,canvas.height);

	// c.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y);
	objects.map(obj => obj.update());
}

init();
animate();