import {Vec2} from "./util.js";

export class CTransform {

	pos=new Vec2(0, 0);
	speed=0;
	angularSpeed=0;
	acceleration=0;
	angle=0;
	scale=1;

	constructor({pos=(new Vec2(0, 0)),speed=0,angularSpeed=0,acceleration=0,angle=0,scale=1}={}){
		Object.assign(this, {pos,speed,angularSpeed,acceleration,angle,scale});
	}

	static create(o){return new CTransform(o);}

	getVelocity(){
		
	}
}

export class CDrawable {
	shape;
	sprite;
	
	constructor({shape=false, sprite=false}={}){
		Object.assign(this,{shape, sprite});
	}
}