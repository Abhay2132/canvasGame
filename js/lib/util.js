export class Vec2 {
	x=0;y=0;
	constructor(x,y){
		x && (this.#x = x);
		y && (this.#y = y);
	}
	dist(){
		return Math.sqrt(this.x*this.x+this.y*this.y);
	}
	
	normalize(){
		let d = this.dist();
		this.x /= d;
		this.y /= d;
	}
	
	add(rhs){
		if ( ! v instanceof Vec2) throw new Error("Vec2 expected, but get a "+rhs);
		return new Vec2(this.x + rhs.x , this.y + rhs.y);
	}
	
	sub(rhs){
		if ( ! v instanceof Vec2) throw new Error("Vec2 expected, but get a "+rhs);
		return new Vec2(this.x - rhs.x , this.y - rhs.y);
	}
	
	scale (n) {
		return new Vec2(this.x*n, this.y*n);
	}
}