import { DocsType } from "./global";

export class TestGenerator {
  public suite: string = "";
  constructor(
    public docs: DocsType,
    public nameOfClassUnderTest: string,
    public timeBudget: number
  ) {
    this.docs = docs;
    this.nameOfClassUnderTest = nameOfClassUnderTest;
    this.timeBudget = timeBudget;
  }

  generateSuite() {
    let shouldContinue = true;
    setTimeout(() => (shouldContinue = false), this.timeBudget);

    this.suite = `describe('${this.nameOfClassUnderTest}, ()=>{
            describe('.repOk', ()=>{
                const instance = new ${this.nameOfClassUnderTest}()
                expect(instance.repOk).tobeTruthy()
            })
        })
    `;
  }
}
