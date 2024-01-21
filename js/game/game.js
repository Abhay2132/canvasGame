import {Engine,EventData as ED} from "../lib/Engine.js";
import {Rect, Polygon} from "../lib/Drawables.js";
import {clip,randInt, C, Vec2} from "../lib/util.js";
import {CTransform} from "../lib/Components.js";
import {isColliding} from "../lib/SAT.js";

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
		this.addSystem(this.#sCollisionDetection.bind(this));
		this.addSystem(this.#sCollisionResolution.bind(this));
	}
	
	spawnPlayer () {
		this.#player = this.createEntity("player");
		
		let cTransform = CTransform.create();
		cTransform.speed=600;

		this.#player.cTransform = cTransform;
		const [x,y] = [20,10]
		this.#player.cDrawable = new Polygon({cTransform: this.#player.cTransform , points:[[x,-y],[x,y],[-x,y],[-x,-y]], strokeStyle: "blue", fillStyle:"green", lineWidth:3});
	}
	
	spawnEnemies () {
			const e = this.createEntity("enemy");
			e.cTransform = CTransform.create({pos: new Vec2(100,300)})
			e.cDrawable = new Polygon({cTransform:e.cTransform, radius:60, sides:5});		
	}
	start(){super.start();}
	
	#sMovement(){

		// to rotate the enemies
		for(let enemy of this.getEntities("enemy")){
			enemy.cDrawable.setAngle(enemy.cTransform.angle + 0.01);
		}

		const {x:tx, y:ty} = ED.touch;
		this.#player.cTransform.pos
		.moveTo(new Vec2(tx,ty), this.#player.cTransform.speed*0.001*this.dt);
	}

	#sCollisionDetection(){
		const player = this.#player;
		const playerVertices = player.cDrawable.getAbsPoints()
		player.collidingWith.length = 0;

		for(let entity of this.getEntities("enemy")){
			const enemyVertices = entity.cDrawable.getAbsPoints();
			if(isColliding(playerVertices, enemyVertices)){
				this.#player.collidingWith.push(entity.id)
				console.log("COLLISION OCCURED!")
			}
		}
	}

	#sCollisionResolution(){
		const entities = this.getEntities();
		for(let entity of entities){
			if(entity.collidingWith.length > 0)
				entity.cDrawable.strokeStyle="red";
		}
	}
}