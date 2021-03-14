import { join } from "path";
// @ts-ignore
import { DocGenerator } from "../../../../lib/morphic";
// @ts-ignore
import { TestGenerator } from "../../../../lib/testGenerator";

describe("it should work", () => {
  let docGenerator: DocGenerator;
  let tg: TestGenerator;
  beforeEach(() => {
    docGenerator = new DocGenerator({
      sourceFileName: "classContainer.ts",
      tsConfigFilePath: join(__dirname, "tsconfig.json"),
    });
    docGenerator.addClassByName("classContainer.ts", "Animal");
    tg = new TestGenerator(docGenerator.classDocs, "Animal", 100);
    tg.generateSuite();
  });
  test("it works", () => {
    expect(tg.suite).toMatch(
      `describe('Animal, ()=>{
          describe('.repOk', ()=>{
            const instance = new Animal()
            expect(instance.repOk).tobeTruthy()
          })
        })`
    );
  });
});
