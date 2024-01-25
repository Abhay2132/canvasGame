import {spanFill,_spanFill} from "./floodFills.js";


const $ = q => document.querySelector(q);
const data = $("#data") 
const grid = $("#grid");
const touch = $("#touch");
const fillBtn = $("#fill-btn")

let gridWidth= parseInt(getComputedStyle(grid).getPropertyValue("width"))
window.cellGrid = [];
const cellSize = 7;
let size = parseInt(gridWidth/cellSize);

const getTouchXY = e => ([e.touches[0].pageX - 10 , e.touches[0].pageY - 10])
const getCellIndicies = (x,y) => ([Math.floor(x/cellSize), Math.floor(y/cellSize)])

//const activeCells = new Set();
for(let i=1;i<=size;i++){
	let row = document.createElement("div");
	row.className = "row";
	
	let _row = [];
	for(let j=1;j<size;j++){
		let cell = document.createElement("div");
		cell.id = i+"-"+j;
		cell.className = "cell";
		cell.style.setProperty("--size", cellSize+"px");
		row.append(cell);
		_row.push(cell)
	}
	cellGrid.push(_row);
	grid.append(row);
}

grid.addEventListener("touchstart", activateCell);
grid.addEventListener("touchmove", activateCell);
grid.addEventListener("touchend", ()=>{lastCell=false});

var lastCell = false;
function activateCell(e){
	let [x,y] = getTouchXY(e);
	let [cx,cy] = getCellIndicies(x,y);
	
	data.textContent = `x:${x}, y:${y}\ncx:${cx}, cy:${cy}`
	touch.style.transform = `translateX(${x}px) translateY(${y}px)`
	
	let currentCellColor = cellGrid[cy][cx].style.background;
	if(fillBtn.checked) {
		return _spanFill(
			cx,cy,
			(a,b)=>_inside(a,b,currentCellColor),
			(a,b,clr="pink") => setCellActive(a,b,clr)
		)
	}
	// to fill the gaps between two grid cells 
	// when user drag two fast
	if(lastCell){
		let [lx,ly]=lastCell
		let dx = lx < cx ? 1 : -1;
		let dy = ly < cy ? 1 : -1;
		while(Math.abs(lx-cx) > 1 || Math.abs(ly-cy) > 1){
			if(Math.abs(lx-cx) > 1) lx += dx;
			if(Math.abs(ly-cy) > 1) ly += dy;
			setCellActive(lx,ly);
		}
	}
	
	setCellActive(cx,cy);
	lastCell = e.type != "touchend" ? [cx,cy] : false;
}

function _inside(x,y, targetColor){
	if(x<0 || x>=cellGrid[0].length
		|| y < 0 || y >= cellGrid.length)
		return false; 
	let cell = cellGrid[y][x];
	return cell.style.background == targetColor
}

function setCellActive(cx,cy, clr="red"){
	let cell = cellGrid[cy][cx];
	//activeCells.add(cell);
	//cell.setAttribute("data-active" , true);
	cell.style.background = clr;
}

function fillAt(x,y){
	
}

