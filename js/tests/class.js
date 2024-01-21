class A {
	name="Abhay"
}

class B extends A{
	constructor(){
		super()
	}
}

class C extends B{
	constructor(){
		super()
	}
	
	getName(){
		return this.name;
	}
}


const c = new C();

console.log(c.getName());