import {rotateD,getOrigin, translateTo,Angle, Vec2} from "./util.js"
import { CTransform } from "./Components.js";

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

export class Polygon {
    #center;
    #points = [];
    #pc = []; // circle for vertices

    cTransform = CTransform.create()
    sides = 3
    radius = 0
    lineWidth = 1
    fillStyle = "transparent"
    strokeStyle = "black"

    constructor({ cTransform = CTransform.create(), sides = 3, radius = 0, points = [], lineWidth = 1, fillStyle = "transparent", strokeStyle = "black" }) {
        Object.assign(this, { cTransform, sides, radius, fillStyle, strokeStyle, lineWidth });

        this.#center = new Circle({ cTransform, r: 1 });
        this.setPoints(points);
    }

    setAngle(rad) {
        this.cTransform.angle = rad;
        if (this.cTransform.angle > 2 * Math.PI) this.cTransform.angle -= 2 * Math.PI
        this.setPoints()
    }

    getPoints() { return [...this.#points]; }

    getAbsPoints() {
		let {x:cx,y:cy}=this.cTransform.pos
        return this.getPoints().map(([x, y]) => ([x + cx, y + cy]));
    }

    setPoints(points) {
        if (Array.isArray(points) && points.length > 0) {
            this.#points = Array.from(points);
            return this;
        }
        let da = Math.PI * 2 / this.sides;
        let {x:ox,y:oy} = this.cTransform.pos
        this.#points.length = 0// = [[this.#getdx(this.cTransform.angle),this.#getdy(this.cTransform.angle)]]
        this.#pc.length = 0;

        const end = 2 * Math.PI + this.cTransform.angle - da;
        //for(let i=this.cTransform.angle ; i <= end; i+=da){
        let i = this.cTransform.angle;
        for (let a = 0; a < this.sides; a++) {
            let x = this.#getdx(i)
            let y = -1 * this.#getdy(i)
            this.#points.push([x, y])

            this.#pc.push(new Circle({ 
				cTransform : CTransform.create({pos:new Vec2(ox+x,oy+y)}), 
                r: 2, 
				c: "blue" 
			}))

            i += da;
        }
    }

    #getdx(angle) {
        return this.radius * Math.cos(angle);
    }

    #getdy(angle) {
        return this.radius * Math.sin(angle);
    }

    draw(ctx) {
        ctx.save();

        // console.log("Drawing polygon of sides : ", this.sides);
		const {x:cx,y:cy} = this.cTransform.pos
        translateTo(ctx, cx,cy);

        const points = this.#points;
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1])
        for (let i = 1; i < points.length; i++) {
            let [x, y] = points[i];
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill()
        ctx.restore();

        this.#center.draw(ctx);

        for (let c of this.#pc) c.draw(ctx);
    }
}

export class Circle {
	cTransform;
	constructor({cTransform=CTransform.create(),r=0,c="red"}={}){
		Object.assign(this, {cTransform,r,c});
	}
	
	draw(ctx) {
		ctx.save();
		
		var radius =this.r;
		
		const {x,y} = this.cTransform.pos
		translateTo(ctx, x,y);
		
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



