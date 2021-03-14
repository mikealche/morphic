"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGenerator = void 0;
var TestGenerator = /** @class */ (function () {
    function TestGenerator(docs, nameOfClassUnderTest, timeBudget) {
        this.docs = docs;
        this.nameOfClassUnderTest = nameOfClassUnderTest;
        this.timeBudget = timeBudget;
        this.suite = "";
        this.docs = docs;
        this.nameOfClassUnderTest = nameOfClassUnderTest;
        this.timeBudget = timeBudget;
    }
    TestGenerator.prototype.generateSuite = function () {
        var shouldContinue = true;
        setTimeout(function () { return (shouldContinue = false); }, this.timeBudget);
        this.suite = "describe('" + this.nameOfClassUnderTest + ", ()=>{\n            describe('.repOk', ()=>{\n                const instance = new " + this.nameOfClassUnderTest + "()\n                expect(instance.repOk).tobeTruthy()\n            })\n        })\n    ";
    };
    return TestGenerator;
}());
exports.TestGenerator = TestGenerator;
