import {rotateD,getOrigin, translateTo,Angle} from "./util.js"

export class Line {
	x1=0;y1=0;
	x2=0;y2=0;
	clr="#000";
	width=1
	
	constructor(x1,y1,x2,y2,clr, width){
		x1 && (this.x1 = x1)
		x2 && (this.x2 = x2)
		y1 && (this.y1 = y1)
		y2 && (this.y2 = y2)
		clr && (this.clr = clr)
		width && (this.width = width)
	}
	
	draw(ctx) {
		ctx.save();
		
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		ctx.strokeStyle=this.clr;
		ctx.lineWidth = this.width;
		ctx.stroke();
		
		ctx.restore();
	}
}

export class Text {
	x= 10;
	y= 20;
	string = '';
	fontSize = 20;
	fontFamily = "Arial";
	clr = "black";
	
	constructor(string, x,y,clr, fontSize, fontFamily){
		string && (this.string = string)
		x && (this.x = x)
		y && (this.y = y)
		clr && (this.clr = clr)
		fontSize && (this.fontSize = fontSize)
		fontFamily && (this.fontFamily = fontFamily)
	}
	
	draw(ctx) {
		ctx.save();
		
		translateTo(ctx, this.x, this.y);
		ctx.font = `${this.fontSize}px ${this.fontFamily}`;
		ctx.fillStyle = this.clr;
		ctx.fillText(this.string, 0, 0);
		
		ctx.restore();
	}
}

export class Rect {
	constructor({x=0,y=0,h=0,w=0,clr="black",strokeClr="transparent",strokeWidth=1, cornerRadius=0, angle=0}) {
		Object.assign(this, {x,y,h,w,clr,strokeClr,strokeWidth,cornerRadius,angle});
	}
	
	draw(ctx){
		rotateD(ctx, this.x, this.y, (this.angle+=1),()=>this._draw(ctx))
	}
	
	_draw(ctx) {
		ctx.save();
		
		translateTo(ctx,this.x, this.y);
		ctx.fillStyle = this.clr;
		ctx.strokeStyle=this.strokeClr
		ctx.lineWidth = this.strokeWidth;
		
		// draw the shape
		if(this.cornerRadius > 0) this.drawRoundedRect(ctx);
		else this.drawSharpRect(ctx);
		
		ctx.restore();
	}
	
	drawSharpRect(ctx){
		let hw=this.w*0.5;
		let hh=this.h*0.5;
		ctx.fillRect(-hw,-hh,this.w, this.h);
		//ctx.strokeRect(-hw,-hh,hw,hh);
	}
	
	drawRoundedRect(ctx){
		let {x,y,w,h,cornerRadius} = this;
		x -= w/2;
		y -= h/2;
		ctx.beginPath();
		ctx.moveTo(cornerRadius, 0);
		ctx.arcTo(x + w, y, x + w, y + h, cornerRadius);
		ctx.arcTo(x + w, y + h, x, y + h, cornerRadius);
		ctx.arcTo(x, y + h, x, y, cornerRadius);
		ctx.arcTo(x, y, x + w, y, cornerRadius);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
}

export class Polygon{
	#center;
	#points=[];
	#pc=[];
	constructor({x=0,y=0,sides=3, length=10, angle=0}){
		Object.assign(this, {x,y,sides,length, angle});
		this.#center = new Circle({x,y,r:1});
		this.#setPoints();
	}
	
	setAngle(rad){
		this.angle=rad;
		if(this.angle > 2*Math.PI) this.angle -= 2*Math.PI
		this.#setPoints()
	}
	
	getPoints(){return [...this.#points];}
	
	#setPoints(){
		let da = Math.PI*2/this.sides;
		let {x:ox,y:oy}=this;
		this.#points.length=0// = [[this.#getdx(this.angle),this.#getdy(this.angle)]]
		this.#pc.length =0;
		
		const end = 2*Math.PI+this.angle-da;
		//for(let i=this.angle ; i <= end; i+=da){
		let i = this.angle;
		for(let a=0;a<this.sides;a++){
			let x =this.#getdx(i)
			let y=-1*this.#getdy(i)
			this.#points.push([x,y])
			this.#pc.push(new Circle({x:this.x+x,y:this.y+y,r:2,c:"blue"}))
			
			i+=da;
		}
	}
	
	#getdx(angle){
		return this.length * Math.cos(angle);
	}
	
	#getdy(angle){
		return this.length * Math.sin(angle);
	}
	
	_draw(ctx){
		rotateD(ctx, this.x, this.y, 
			(this.angle+=1),()=>this._draw(ctx))
	}
	
	draw(ctx) {
		ctx.save();
		
		const points = this.#points;
		ctx.beginPath();
		translateTo(ctx, this.x, this.y);
		ctx.moveTo(points[0][0],points[0][1])
		for(let i=1; i<points.length; i++){
			let [x,y]=points[i];
			ctx.lineTo(x,y);
		}
		ctx.closePath();
		ctx.stroke();
		
		ctx.restore();
		
		this.#center.draw(ctx);
		
		for(let c of this.#pc) c.draw(ctx);
	}
}

export class Circle {
	constructor({x=0,y=0,r=0,c="red"}={}){
		Object.assign(this, {x,y,r,c});
	}
	
	draw(ctx) {
		ctx.save();
		
		var radius =this.r;
		
		translateTo(ctx,this.x, this.y);
		
		ctx.fillStyle=this.c;
		ctx.strokeStyle=this.c
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.stroke();
		
		ctx.restore();
	}
}



