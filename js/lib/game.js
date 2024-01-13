import {Line} from "./Drawables.js";
import FPS from "../game/entities/FPS.js";

export default class Game {
	#ctx;
	#lastTe=0
	#isRunning=true
	#entities=[]
	#fps = new FPS();
	#player
	
	#tx=0
	#ty=0
	#isTouching = false;
	#handleTouch(e){
            event.preventDefault();
            this.#isTouching = e.type !== "touchend";
            event.touches[0] && (this.#tx = event.touches[0].pageX - this.#ctx.canvas.offsetLeft)
            event.touches[0] && (this.#ty = event.touches[0].pageY - this.#ctx.canvas.offsetTop)
	}

	constructor(ctx){
		if(!ctx) throw new Error("canvas ctx is "+ctx);
		
		this.#ctx = ctx;
		this.#ctx.canvas.addEventListener("touchmove", this.#handleTouch.bind(this));
		this.#ctx.canvas.addEventListener("touchstart", this.#handleTouch.bind(this));
		this.#ctx.canvas.addEventListener("touchend", this.#handleTouch.bind(this));
		
		// add entities || game objects to the game
		
		const line = new Line(100, 100, 100, 500);
		line.update = (dt) => {
			line.x2 = this.#tx;
			line.y2 = this.#ty;
		}

		 
		this.#entities.push(line);
	}
	
	start(){
		window.requestAnimationFrame(this.#run.bind(this));
	}
	
	#run(te=0) {
		if(this.#isRunning) window.requestAnimationFrame(this.#run.bind(this)) ;
		let dt = te - this.#lastTe;
		this.#lastTe = te;
		this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
		
		for(let entity of this.#entities){
		//this.#processEvent()
		
			entity.update(dt)
			entity.draw(this.#ctx)
			
		}
		this.#fps.update(dt)
		this.#fps.draw(this.#ctx);
	}
	
	#sMovement(entity) {
		
	}
	
	#sRender(e){
		e.cDrawable.draw(this.#ctx);
	}
}