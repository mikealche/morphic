// type Person = {
//   firstname: string;
//   age: 34;
// };

import { Person, Place } from "./classContainer2";

export class Animal {
  constructor(name: string, color: string) {}
  bark(toWhom: Person, where: Place): string {
    return "bark!";
  }
}
