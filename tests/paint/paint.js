import {_spanFill,spanFill,isIn, floodFill, getCurrentColor} from "./floodFill.js";
var stats = 0
var canvas = document.getElementById("paint");
const fill = document.getElementById("fill");

window.ctx = canvas.getContext("2d",{ willReadFrequently: true });

window.onresize = () => {
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight-5;
}
window.onresize();

// Paint App code

const shapes = []; 

function Line (x=0,y=0 ){
	if(! (this instanceof Line)) return new Line(...arguments);
	let [X, Y] = [parseFloat(x), parseFloat(y)]
	if(!(X&&Y))throw new Error(`Starting point of line is invalid \n x : ${x}\n y : ${y}`);
	
	const points = [[X,Y]];
	this.points = points;
	
	this.lastPoint = function (){
		return points.at(-1);
	}
	
	this.draw = function (ctx){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(points[0][0],points[0][1]);
		for(let i=1;i<points.length;i++){
			ctx.lineTo(points[i][0],points[i][1]);
		}
		ctx.strokeStyle="blue";
		ctx.lineWidth = 3
		ctx.stroke();
		ctx.restore();
		return this;
	}
	
	this.addPoint = function (x,y){;
		if(!areNum(x,y)) throw new Error(`invalid x(${x}) or y(${y})`)
		points.push([parseFloat(x),parseFloat(y)]);
		
		this.len += 1;
		return this;
	}
	
}

const areNum = (...a) => a.filter(n => NaN == parseFloat(n)).length == 0;
const getTouchXY = e => ([e.touches[0].pageX - canvas.offsetLeft , e.touches[0].pageY - canvas.offsetTop])
const dist = (x1,y1,x2,y2) => Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
canvas.addEventListener("touchstart", e => {
	if(!window.doDraw) return;
	const [x,y] = getTouchXY(e);
	shapes.push(Line(x,y))
});

canvas.addEventListener("touchmove", e => {
	if(!window.doDraw) return;
	const [x,y] = getTouchXY(e);
	if(dist(x,y, ...shapes.at(-1).lastPoint()) < 1) return;
	shapes.at(-1).addPoint(x,y);
});

window.doDraw = 1;
// main draw loop
function draw() {
	window.requestAnimationFrame(draw)
	if(!window.doDraw) return;
	ctx.save();
	ctx.fillStyle="white";
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.restore()
	for(let shape of shapes){
		shape.draw(ctx);
	}
}
draw();

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
	ctx.fillStyle="pink"
	spanFill(
		x,y,
		(x1,y1)=>isIn(ctx, x1, y1, currentColor),
		(x,y)=>{ctx.fillRect(x,y,1,1)}
	)
	ctx.restore();
})














