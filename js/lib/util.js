export class Vec2 {
	#x=0;#y=0;
	constructor(x=0,y=0){
		this.#x = parseFloat(x);
		this.#y = parseFloat(y);
	}
	dist(){
		return Math.sqrt((this.#x*this.#x)+(this.#y*this.#y));
	}

	offset(dx,dy){
		if(dx && dy){
			this.#x += parseFloat(dx);
			this.#y += parseFloat(dy);
		}
		return this;
	}

	set x(v){this.#x = parseFloat(v) || 0}
	set y(v){this.#y = parseFloat(v) || 0}
	get x(){return this.#x}
	get y(){return this.#y}
	
	normalize(){
		let d = this.dist();
		this.#x /= d;
		this.#y /= d;
		return this;
	}
	
	add(rhs){
		if ( ! rhs instanceof Vec2) throw new Error("Vec2 expected, but get a "+rhs);
		return new Vec2(this.#x + rhs.x , this.#y + rhs.y);
	}
	
	sub(rhs){
		if ( ! rhs instanceof Vec2) throw new Error("Vec2 expected, but get a "+rhs);
		return new Vec2(this.#x - rhs.x , this.#y - rhs.y);
	}
	
	scale (n) {
		return new Vec2(this.#x*n, this.#y*n);
	}

	normL(){
		
	}

	angle(){
		return Math.atan(y/x);
	}

	moveTo(dest, ds){
		if(dest.sub(this).dist()<ds) {
			this.x = dest.x;
			this.y = dest.y;
			return;
		}
		let vv = dest.sub(this).normalize().scale(ds); // vv : Instantaneous VelocityVector
		this.offset(vv.x,vv.y);
	}
}

export function clip (n,min,max){
	if(n<min) return min;
	if(n>max) return max;
	return n;
}

export function d2r(d){return Math.PI*d/180;}
export function r2d(r){return 180*r/Math.PI;}

export class Angle {
	#degree=0;
	#radian=0;
	
	constructor(deg=0){
		this.setDegree(0);
	}
	
	setDegree(deg){
		this.#degree=deg;
		this.#radian = d2r(deg);
		return this;
	}
	
	setRadian(rad){
		this.#degree= r2d(rad);
		this.#radian = rad;
		return this;
	}
	
	getDegree(){return this.#degree;}
	getRadian(){return this.#degree;}
}

export function rotateD(ctx,cx=0,cy=0,angle=0,draw=()=>{}){
	rotateR(ctx,cx,cy,d2r(angle),draw)
}

export function rotateR(ctx,cx=0,cy=0,angle=0,draw=()=>{}) {
	ctx.save();
	ctx.translate(cx, cy);
	ctx.rotate(angle);
	draw();
	ctx.restore();
}

export function getOrigin(ctx){
	const transformMatrix = ctx.getTransform();
	return [ transformMatrix.m41,transformMatrix.m42 ]
}

export function originOffset(ctx, x,y){
	const [ox,oy] = getOrigin(ctx);
	return [x-ox, y-oy];
}

export function translateTo(ctx,x,y){
	const [ox,oy] = getOrigin(ctx);
	ctx.translate(x-ox, y-oy);
}

export function randInt(min,max) {
	return Math.floor((Math.random()*(max-min+1))+min);
}

export const C = {
	_body : document.querySelector('#console-body'),
	log(...args){
		const out = this._body
		out.innerHTML += args.join(" ")+"<br>"; 
		out.scrollTop = out.scrollHeight;
		return this;
	},
	clear(){this.c.innerHTML=""; return this;}
}


