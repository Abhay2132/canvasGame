import {Text} from "../../lib/Drawables.js";

export default class FPS {
	#te = 0;
	#fpsCount = 0;
	#fps = new Text("fps : 0");
	#fpsUpdateInterval = 500;
	
	constructor(fui){
		this.#fps.fontSize = 10;
		fui && (this.#fpsUpdateInterval = fui)
	}
	
	update (dt) {
		if(this.#te < this.#fpsUpdateInterval) return (this.#te += dt);
		this.#fpsCount = parseInt(1000/dt);
		this.#fps.string = `fps : ${this.#fpsCount}`;
		this.#te =0;
	}
	
	draw(ctx) {
		this.#fps.draw(ctx);
	}
}
