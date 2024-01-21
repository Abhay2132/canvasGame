import {Engine,EventData} from "../lib/Engine.js";
import {Rect, Polygon} from "../lib/Drawables.js";
import {clip,randInt, C} from "../lib/util.js";
import {CTransform} from "../lib/Components.js";

export default class Game extends Engine {
	#ctx;
	#player;
	
	constructor(ctx){
		if(!ctx) throw new Error("canvas.context missing Game constructor");
		super(ctx);
		ctx && (this.#ctx = ctx)
		
		this.init();
	}
	
	init (){
		// this.addSystem(() =>console.log( this.getEntities() ))
		this.spawnPlayer();
		this.spawnEnemies();
		this.addSystem(this.#sMovement.bind(this));
	}
	
	spawnPlayer () {
		this.#player = this.createEntity("player");
		this.#player.cTransform = new CTransform()
		this.#player.cDrawable = new Rect({
			x:100, y:100, h:50,w:80, cornerRadius: 0, clr: "#284726",
			angle:0.2850000000000002
		});
		
	}
	
	spawnEnemies () {
			const e = this.createEntity("enemy");
			e.cTransform = new CTransform();
			e.cDrawable = new Polygon({x:100,y: 300,
				length:60, sides:5});
				
			this.nme= e;
			
			window._nme = e;
		
	}
	start(){super.start();}
	
	#sMovement(){
		this.nme.cDrawable.setAngle(this.nme.cDrawable.angle + 0.01);
		
		// console.log(EventData.touch.x, EventData.touch.y);
		this.#player.cDrawable.x = clip(EventData.touch.x, this.#player.cDrawable.w/2, this.#ctx.canvas.width - 40) 
		this.#player.cDrawable.y = clip(EventData.touch.y, this.#player.cDrawable.h/2, this.#ctx.canvas.height - 25)
	}
}