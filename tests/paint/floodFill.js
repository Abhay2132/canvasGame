
export const getCurrentColor = (ctx, x,y) => {
	const pixelData = ctx.getImageData(x, y, 1, 1).data
	return rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
}

// Helper function to convert RGB values to a hex color code
function rgbToHex(r, g, b) {
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function isIn(ctx, x, y, targetColor) {
	if (x<0 || x>=ctx.canvas.width || y<0|| y>=ctx.canvas.height) return false
	const currentColor = getCurrentColor(ctx, x,y);
	//console.log(currentColor,targetColor)
	if (currentColor !== targetColor) {
		//console.log(currentColor,targetColor)
		return false;
	}
	return true;
}

const s=1
const wait = (n=0) => new Promise(r => setTimeout(r, n))
export function floodFill(ctx, x, y, targetColor, fillColor) {
	ctx.fillStyle = fillColor;
	const q = [[x,y]];
	window.requestAnimationFrame(function aaa(){
		if(!q.length)return
		 window.requestAnimationFrame(aaa); 
		let n = q.shift();
		let [X,Y] = n;
		if(!isIn(ctx, X, Y, targetColor)) return ;
		ctx.fillRect(X,Y,s,s);
		//area.addPoint(X,Y)
		isIn(ctx, X+s, Y, targetColor) && q.push([X+s,Y]);
		isIn(ctx, X-s, Y, targetColor) && q.push([X-s,Y]);
		isIn(ctx, X, Y+s, targetColor) && q.push([X,Y+s]);
		isIn(ctx, X, Y-s, targetColor) && q.push([X,Y-s ]);
	});
}

var lastImageData = {
	data : false,
	time : performance.now()
}

export function _spanFill(x,y,inside, _set){
	if(!inside(x,y)) return;
	let s = [];
	s.push([x,x,y,1])
	s.push([x,x,y-1,-1])
	while(s.length > 0){
		//await wait(1);
		let [x1,x2,y,dy]=s.shift();
		let x = x1;
		if(inside(x,y)){
			while(inside(x-1,y)){
				_set(x-1, y)
				x=x-1
			}
			if(x < x1){
				s.push([x,x1-1,y-dy,-dy])
			}
		}
		while(x1<=x2){
			while(inside(x1,y)){
				//await wait(1);
				_set(x1,y);
				x1 = x1+1;
			}
			if ( x1 > x){
				s.push([x,x1-1,y+dy,dy])
			}
			if(x1-1>x2){
				s.push([x2+1, x1-1, y-dy, -dy])
			}
			x1 = x1+1
			while(x1<x2 && !inside(x1,y)){
				x1 = x1+1
			}
			x = x1
		}
	}
}

export async function spanFill(x,y, inside, _set, hr) {
	if(!inside(x,y)) return;
	let s = [[x,y]];
	console.log(x,y)
	while(s.length > 0){
		let [X,Y] = s.shift();
		let lx = X
		
		while(inside(lx-1, Y)){
			//await wait(1);
			//_set(lx-1,Y);
			lx = lx-1;
		}
		while(inside(X,Y)){
			//await wait(1);
			//_set(X,Y)
			X = X+1
		}
		await wait(1);
		scan(lx, X-1, Y+1, s, inside)
		scan(lx, X-1, Y-1, s, inside)
		
		hr(lx+1,X-1, Y);
	}
}

function scan(lx, rx, y, s, inside) {
	//console.log("scanning for seed at y : ", y);
	let span_added = false;
	for(let x=lx;x <= rx; x++){
		if(!inside(x,y))
			span_added = false;
		else if (!span_added){
			s.push([x,y])
			span_added = true;
		}
	}
}