// type Person = {
//   firstname: string;
//   age: 34;
// };

export class Person {
  private firstname: string;
  private age: number;
  constructor(firstname: string, age: number) {
    this.firstname = firstname;
    this.age = age;
  }
}

export class Place {
  private lat;
  private lng;
  constructor(lat: 123, lng: 543) {
    this.lat = lat;
    this.lng = lng;
  }
}
