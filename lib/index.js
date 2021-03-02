"use strict";
// type Person = {
//   firstname: string;
//   age: 34;
// };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
var Person = /** @class */ (function () {
    function Person(firstname, age) {
        this.firstname = firstname;
        this.age = age;
    }
    return Person;
}());
var Place = /** @class */ (function () {
    function Place(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }
    return Place;
}());
var Animal = /** @class */ (function () {
    function Animal(name, color) {
    }
    Animal.prototype.bark = function (toWhom, where) {
        return "bark!";
    };
    return Animal;
}());
exports.Animal = Animal;
