import {EntityMan} from "./Entity.js";
import FPS from "../game/entities/FPS.js";

export const EventData = {
	touch : { x:0,y:0, active:false},
	//key : { 
}

export class Engine extends EntityMan{
	#ctx;
	#lastTe=0
	isRunning=true
	
	#fps = new FPS();
	#player
	
	#tx=0
	#ty=0
	#isTouching = false;
	
	#handleTouch(e){
            event.preventDefault();
            EventData.touch.active = e.type !== "touchend";
            event.touches[0] && (EventData.touch.x = event.touches[0].pageX - this.#ctx.canvas.offsetLeft)
            event.touches[0] && (EventData.touch.y = event.touches[0].pageY - this.#ctx.canvas.offsetTop)
	}
	#systems=[];
	dt=16;
	te=performance.now();

	constructor(ctx){
		if(!ctx) throw new Error("canvas ctx is "+ctx);
		super();
		this.#ctx = ctx;
		this.#ctx.canvas.addEventListener("touchmove", this.#handleTouch.bind(this));
		this.#ctx.canvas.addEventListener("touchstart", this.#handleTouch.bind(this));
		this.#ctx.canvas.addEventListener("touchend", this.#handleTouch.bind(this));
	}
	
	addSystem(s){
		if(typeof s != "function") throw new Error("System should be a `function` type");
		this.#systems.push(s);
	};
	
	start(){
		window.requestAnimationFrame(this.#run.bind(this));
	}
	
	#run(te=0) {
		window.requestAnimationFrame(this.#run.bind(this)) ;
		if(!this.isRunning) return;
		this.te = te;
		this.dt = te - this.#lastTe;
		this.#lastTe = te;
		
		this.udpateEntities();
		for(let s of this.#systems){
			s();
		}
		
		// render entities on screen
		this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
		for(let e of this.getEntities()){
			if(! e.isActive) continue;
			e?.cDrawable?.draw(this.#ctx);
		}
		
		this.#fps.update(this.dt)
		this.#fps.draw(this.#ctx);
	}
	
	
}