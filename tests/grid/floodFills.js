const wait = (n=0) => new Promise(r => setTimeout(r, n))

export async function spanFill(x,y, inside, _set) {
	if(!inside(x,y)) return;
	let s = [[x,y]];
	//console.log("spanFill")
	while(s.length > 0){
		let [X,Y] = s.shift();
		let lx = X
		
		while(inside(lx-1, Y)){
			await wait(1);
			_set(lx-1,Y);
			lx = lx-1;
		}
		while(inside(X,Y)){
			await wait(1);
			_set(X,Y,"orange")
			X = X+1
		}
		scan(lx, X-1, Y+1, s, inside)
		scan(lx, X-1, Y-1, s, inside)
	}
}

function scan(lx, rx, y, s, inside) {
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

export async function _spanFill(x,y,inside, _set){
	if(!inside(x,y)) return;
	let s = [];
	s.push([x,x,y,1])
	s.push([x,x,y-1,-1])
	while(s.length > 0){
		let [x1,x2,y,dy]=s.shift();
		let x = x1;
		if(inside(x,y)){
			while(inside(x-1,y)){
				await wait(1);
				_set(x-1, y)
				x=x-1
			}
			if(x < x1){
				s.push([x,x1-1,y-dy,-dy])
			}
		}
		while(x1<=x2){
			while(inside(x1,y)){
				await wait(1);
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