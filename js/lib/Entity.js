import {CTransform} from "./Components.js';

class Entity {
	id=0;
	tag="default";
	isActive = true;
	
	constructor(id, tag) {
		id && (this.id = id)
		tag && (this.tag = tag)
	}
	
	cTransform = new CTransform();
	cDrawable;
}

export class EntityMan {
	#entities = new Map(); // { tag<string> : [<Entity>] }
	#toAdd = [];
	#total = 0;
	
	constructor(){}
	
	createEntity(tag) {
		let e = new Entity(this.#total++, tag) ;
		this.#toAdd.push(e);
		return e;
	}
	
	getEntities(tag){
		if(!tag) return Array.from(this.#entities.values()).flat()
		return this.#entities.get(tag);
	}
	
	udpate() {
		// adding the entities from queue
		for(let e of this.#toAdd) {
			if(this.#entities.has(tag)){
				this.#entities.get(tag).push(e); 
			} else {
				this.#entities.set(tag,[e]);
			}
		}
		this.#toAdd.length = 0;
		
		// removing the non-active entities
		for(let entities of this.#entities.values()){
			for(let i=0;i<entities.length; i++){
				if(!entities[i].isActive) entities.splice(i,1);
			}
		}
	}
}