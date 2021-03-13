class Person {
  private firstname: string;
  private age: number;
  constructor(firstname: string, age: number) {
    this.firstname = firstname;
    this.age = age;
  }
}

type BarkType = {
  toWhom: Person;
  age: number;
};

export class Animal {
  constructor(name: string, color: string) {}
  bark(options: BarkType): string {
    return "bark!";
  }
}
