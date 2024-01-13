class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // call the super class constructor and pass in the name parameter
    this.name = "Abhay";
  }


}

const d = new Dog("Mitzie");
d.speak(); // Mitzie barks.

console.log(d instanceof Animal)