import {_spanFill,spanFill,isIn, floodFill, getCurrentColor} from "./floodFill.js";
var stats = 0
const $ = q => document.querySelector(q);
const fill = $("#fill");
const isDrawing = $("#isDrawing");
const canvas = $("#paint");
const colorsTag = $("#colors");

window.ctx = canvas.getContext("2d",{ willReadFrequently: true });

window.onresize = () => {
document.documentElement.style.setProperty("--innerWidth", window.innerWidth+"px")
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight-40;
}
window.onresize();

// Paint App code

window.shapes = [];
window.selectedColor = "#0000ff"; // blue

function Line (x=0,y=0,id, lw=3){
	if(! (this instanceof Line)) return new Line(...arguments);
	let [X, Y] = [parseFloat(x), parseFloat(y)]
	if(!(X&&Y))throw new Error(`Starting point of line is invalid \n x : ${x}\n y : ${y}`);
	
	let i = 0;
	const points = [[X,Y]];
	this.points = points;
	this.id = id
	
	ctx.beginPath();
	ctx.moveTo(X,Y);
	this.lastPoint = function (){
		return points.at(-1);
	}
	
	this.draw = function (ctx){
		ctx.save();
		while(i < points.length){
			ctx.lineTo(points[i][0],points[i][1]);
			i += 1;
		}
		ctx.strokeStyle = window.selectedColor;
		ctx.lineWidth = lw
		ctx.stroke();
		ctx.restore();
		
		window.doDraw=false;
		return this;
	}
	
	this.addPoint = function (x,y){;
		if(!areNum(x,y)) throw new Error(`invalid x(${x}) or y(${y})`)
		points.push([parseFloat(x),parseFloat(y)]);
		
		window.doDraw = 1;
		return this;
	}
	
}

const areNum = (...a) => a.filter(n => NaN == parseFloat(n)).length == 0;
const getTouchXY = e => ([e.touches[0].pageX - canvas.offsetLeft , e.touches[0].pageY - canvas.offsetTop])
const dist = (x1,y1,x2,y2) => Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));

canvas.addEventListener("touchstart", e => {
	window.doDraw = !fill.checked;
	if(!window.doDraw) return;
	const [x,y] = getTouchXY(e);
	shapes.push(Line(x,y,shapes.length))
});

canvas.addEventListener("touchmove", e => {
	window.doDraw = !fill.checked;
	if(!window.doDraw) return;
	const [x,y] = getTouchXY(e);
	if(dist(x,y, ...shapes.at(-1).lastPoint()) < 1) return;
	shapes.at(-1).addPoint(x,y);
});

canvas.addEventListener("touchend", e => {
})

window.doDraw = 0
// main draw loop
function draw() {
	window.requestAnimationFrame(draw)
	isDrawing.checked = window.doDraw
	if(!window.doDraw) return 
	//ctx.clearRect(0,0,canvas.width, canvas.height);
	shapes.length && shapes.at(-1).draw(ctx);
}
draw();

function hr(ctx,x1,x2,y,clr){
	ctx.beginPath();
	ctx.moveTo(x1,y);
	ctx.lineTo(x2,y);
	ctx.lineWidth=1;
	ctx.strokeStyle=clr;
	ctx.stroke();
}

canvas.addEventListener("click", e => {
	window.doDraw = !fill.checked;
	if(!fill.checked) return;
	const [x,y] = [e.clientX, e.clientY]
	console.log("flood filling");
	const currentColor = getCurrentColor(ctx, x,y);
	//let area = Area();
	//shapes.push(area);
	//window.doDraw = false;
	//floodFill(ctx, x,y,currentColor, "red");
	ctx.save();
	let clr="pink"
	/*
	_spanFill(
		x,y,
		(x1,y1)=>isIn(ctx, x1, y1, currentColor),
		(x,y,clr="pink")=>{ctx.fillStyle=clr; ctx.fillRect(x,y,1,1)},
		(x1,x2,y) => hr(ctx,x1,x2,y,clr)
	)
	*/
	fillAt(x,y)
	ctx.restore();
})

/* 
 * new Flood fill implementation wrapper 
 */

function fillAt(x,y){
	const imgD =ctx.getImageData(0,0,canvas.width, canvas.height);
	const fillColor = hexToRgba(selectedColor);
	const targetColor =  colorAt(imgD, x,y);
	
	/*
	Promise.all([_spanFill(
		x,y,
		(x,y) => isInside(imgD, targetColor, x,y),
		(x,y) => setColor(imgD, fillColor, x,y)
	)])
	.then(() => {
		ctx.putImageData(imgD,0,0);
	})
	*/
	_spanFill(
		x,y,
		(x,y) => isInside(imgD, targetColor, x,y),
		(x,y) => setColor(imgD, fillColor, x,y)
	)
	ctx.putImageData(imgD,0,0);
}

function setColor(imageData,fillColor, x,y){
	imageData.data[y * (imageData.width * 4) + x * 4 + 0] = fillColor[0]
	imageData.data[y * (imageData.width * 4) + x * 4 + 1] = fillColor[1]
	imageData.data[y * (imageData.width * 4) + x * 4 + 2] = fillColor[2]
	imageData.data[y * (imageData.width * 4) + x * 4 + 3] = fillColor[3]
}

function isInside (imgD, targetColor, x,y){
	if(x<0 || x>=imgD.width || y<0 || y>=imgD.height)
		return false;
	return areEqual(targetColor, colorAt(imgD,x,y))
}

function areEqual(arr1,arr2){
	if(arr1.length != arr2.length) return false;
	for(let i=0;i<arr1.length;i++)
		if(arr1[i] != arr2[i]) return false;
	return true;
}

function colorAt(imageData,x,y){
	return [
		imageData.data[y * (imageData.width * 4) + x * 4 + 0],
		imageData.data[y * (imageData.width * 4) + x * 4 + 1],
		imageData.data[y * (imageData.width * 4) + x * 4 + 2],
		imageData.data[y * (imageData.width * 4) + x * 4 + 3]
	]
}

function hexToRgba(hex) {
  // Remove the hash if present
  hex = hex.replace(/^#/, '');

  // Parse the hex code into RGB values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Return the RGBA array
  return [r, g, b, 255]; // The fourth value (alpha) is set to 255 (fully opaque)
}

// adding color options in UI
const colors = ["#ff0000", "#00ff00", "#0000ff"]
colorsTag.innerHTML =''
colors.forEach(value => {
	const div = document.createElement("div")
	div.className = `color${value == selectedColor ? " color-selected" : ""}`
	div.setAttribute("data-color-code", value);
	div.style.background = value;
	div.addEventListener("click", setSelectedColor);
	colorsTag.append(div);
});

function setSelectedColor(e){
	let colorCode = e.target.dataset.colorCode
	$(".color-selected").classList.remove("color-selected")
	e.target.classList.add("color-selected");
	window.selectedColor = colorCode
	
	ctx.fillStyle=window.selectedColor
	ctx.strokeStyle=window.selectedColor
}
ctx.fillStyle=window.selectedColor
//ctx.strokeStyle=window.selectedColor



