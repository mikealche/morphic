// type Person = {
//   firstname: string;
//   age: 34;
// };

class Person {
  private firstname: string;
  private age: number;
  constructor(firstname: string, age: number) {
    this.firstname = firstname;
    this.age = age;
  }
}

interface IBarkProps {
  toWhom: Person;
  age: number;
}

export class Animal {
  constructor(name: string, color: string) {}
  bark(options: IBarkProps): string {
    return "bark!";
  }
}
