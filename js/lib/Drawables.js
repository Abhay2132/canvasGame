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
		// saving old props
		let ss = ctx.strokeStyle
		let lw = ctx.lineWidth;
		
		ctx.beginPath();
		ctx.moveTo(this.x1, this.y1);
		ctx.lineTo(this.x2, this.y2);
		
		ctx.strokeStyle=this.clr;
		ctx.lineWidth = this.width;
		
		ctx.stroke();
		
		// restore old props
		ctx.strokeStyle = ss;
		ctx.lineWidth = lw;
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
		let f = ctx.font;
		let fs = ctx.fillStyle;
		
		ctx.font = `${this.fontSize}px ${this.fontFamily}`;
		ctx.fillStyle = this.clr;
		
		ctx.fillText(this.string, this.x, this.y);
		
		ctx.font = f;
		ctx.fillStyle = fs;
	}
}