var bgColor;
var canvas;
var canvasImage;
var triangleCount;
var triangles;
var color;
var context;
var draggingDraw;
var draggingMove;
var dragX;
var dragY;
var dragIndexDelete;
var dragIndexMove;
var dragStartLocation;
var mouseX;
var mouseY;
var radius;
var targetX;
var targetY;
var tempX;
var tempY;
var dx;
var dy;
var flagRandom = false;

window.addEventListener('load', init, false);


window.onload = window.onresize = function () {
	var canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth * 0.6;
	canvas.height = window.innerHeight * 0.8;
	drawTriangles();
}


function init() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext('2d');
	context.lineWidth = 4;
	context.lineCap = 'round';

	triangleCount = 0;
	draggingDraw = false;
	bgColor = "#000000";
	triangles = [];


	canvas.addEventListener('mousedown', dragStart, false);
	canvas.addEventListener('mousemove', drag, false);
	canvas.addEventListener('mouseup', dragStop, false);


	canvas.addEventListener('dblclick', deleteTriangle, false);
}






function dragStart(event) {
	draggingDraw = true;
	dragStartLocation = getCanvasCoordinates(event);
	color = "rgb(" + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + ")";
	getImage();
}

function drag(event) {
	var position;
	if (draggingDraw === true) {
		putImage();
		position = getCanvasCoordinates(event);
		drawTriangle(position);
		context.fillStyle = color;
		context.fill();
	}
}

function dragStop(event) {
	draggingDraw = false;
	putImage();
	var position = getCanvasCoordinates(event);
	drawTriangle(position);
	context.fillStyle = color;
	context.fill();
	triangleCount = triangleCount + 1;
	tempTriangle = {
		x: tempX,
		y: tempY,
		rad: radius,
		color: color
	};

	triangles.push(tempTriangle);

}

function getCanvasCoordinates(event) {

	var x = event.clientX - canvas.getBoundingClientRect().left,
		y = event.clientY - canvas.getBoundingClientRect().top;

	return {
		x: x,
		y: y
	};
}

function getImage() {
	canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}

function putImage() {
	context.putImageData(canvasImage, 0, 0);
}

function drawTriangle(position) {

	tempX = dragStartLocation.x;
	tempY = dragStartLocation.y;
	context.beginPath();
	context.moveTo(tempX, tempY);
	context.lineTo(position.x, position.y);
	context.lineTo(tempX, position.y);
	context.closePath();
}





function drawScreen() {
	triangleCount = 0;
	triangles = [];
	context.fillStyle = bgColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
}





function togglebtn() {

	if (document.getElementById("btnMve").name == "Draw Shape") {

		canvas.removeEventListener("mousedown", mouseDown, false);
		document.getElementById("btnMve").style.backgroundColor = "white";
		document.getElementById("btnMve").name = "Move Shape";
		document.getElementById("spid").innerHTML = "Click here to move the Triangle";

		canvas.addEventListener('mousedown', dragStart, false);
		canvas.addEventListener('mousemove', drag, false);
		canvas.addEventListener('mouseup', dragStop, false);
	} else if (document.getElementById("btnMve").name == "Move Shape") {

		canvas.removeEventListener("mousedown", dragStart, false);
		canvas.removeEventListener("mousemove", drag, false);
		canvas.removeEventListener("mouseup", dragStop, false);

		document.getElementById("btnMve").style.backgroundColor = "blue";
		document.getElementById("btnMve").name = "Draw Shape";
		document.getElementById("spid").innerHTML = "Re-click here to draw the Triangle";

		canvas.addEventListener('mousedown', mouseDown, false);
	}
}





function drawTriangles() {
	var i;
	var x;
	var y;
	var rad;
	var color;

	context.fillStyle = bgColor;
	context.fillRect(0, 0, canvas.width, canvas.height);

	for (i = 0; i < triangleCount; i++) {
		rad = triangles[i].rad;
		x = triangles[i].x;
		y = triangles[i].y;
		color = triangles[i].color;
		context.beginPath();
		context.arc(x, y, rad, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillStyle = color;
		context.fill();
	}
}

function isTriangleClicked(shape, mx, my) {
	var dx;
	var dy;
	dx = mx - shape.x;
	dy = my - shape.y;
	return (dx * dx + dy * dy < shape.rad * shape.rad);
}





function deleteTriangle(event) {
	var i;
	var bRect = canvas.getBoundingClientRect();

	dragIndexDelete = -1;

	mouseX = (event.clientX - bRect.left) * (canvas.width / bRect.width);
	mouseY = (event.clientY - bRect.top) * (canvas.height / bRect.height);

	for (i = 0; i < triangleCount; i++) {
		if (isTriangleClicked(triangles[i], mouseX, mouseY)) {
			dragIndexDelete = i;
		}
	}

	if (dragIndexDelete > -1) {
		triangles.splice(dragIndexDelete, 1)[0];
		triangleCount = triangleCount - 1;
	}

	if (event.preventDefault) {
		event.preventDefault();
	} else if (event.returnValue) {
		event.returnValue = false;
	}
	drawTriangles();
	return false;
}





function mouseDown(event) {
	var i;
	var highestIndex = -1;
	var bRect = canvas.getBoundingClientRect();

	mouseX = (event.clientX - bRect.left) * (canvas.width / bRect.width);
	mouseY = (event.clientY - bRect.top) * (canvas.height / bRect.height);


	for (i = 0; i < triangleCount; i++) {
		if (isTriangleClicked(triangles[i], mouseX, mouseY)) {
			draggingMove = true;
			if (i > highestIndex) {
				dragX = mouseX - triangles[i].x;
				dragY = mouseY - triangles[i].y;
				highestIndex = i;
				dragIndexMove = i;
			}
		}
	}
	if (draggingMove) {
		window.addEventListener("mousemove", mouseMove, false);

		triangles.push(triangles.splice(dragIndexMove, 1)[0]);

	}
	canvas.removeEventListener("mousedown", mouseDown, false);
	window.addEventListener("mouseup", mouseUp, false);

	if (event.preventDefault) {
		event.preventDefault();
	} else if (event.returnValue) {
		event.returnValue = false;
	}
	return false;
}

function mouseUp(event) {

	canvas.addEventListener("mousedown", mouseDown, false);
	window.removeEventListener("mouseup", mouseUp, false);
	if (draggingMove) {
		draggingMove = false;
		window.removeEventListener("mousemove", mouseMove, false);
	}
}

function mouseMove(event) {

	var posX;
	var posY;
	var shapeRad = triangles[triangleCount - 1].rad;
	var minX = shapeRad;
	var maxX = canvas.width - shapeRad;
	var minY = shapeRad;
	var maxY = canvas.height - shapeRad;

	var bRect = canvas.getBoundingClientRect();
	mouseX = (event.clientX - bRect.left) * (canvas.width / bRect.width);
	mouseY = (event.clientY - bRect.top) * (canvas.height / bRect.height);

	posX = mouseX - dragX;
	posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
	posY = mouseY - dragY;
	posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

	triangles[triangleCount - 1].x = posX;
	triangles[triangleCount - 1].y = posY;

	drawTriangles();
}