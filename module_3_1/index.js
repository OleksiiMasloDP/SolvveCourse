// #1
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.getName = function () {
  return this.name;
};
const person1 = new Person("Alex", 27);

// #2
Object.defineProperty(person1, "name", {
  configurable: false,
  writable: false,
});

// #3
class PersonClass {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  get getName() {
    return this.name;
  }
}

const person2 = new PersonClass("Alex", 27);
