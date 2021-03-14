import { join } from "path";
// @ts-ignore
import { DocGenerator } from "../../../lib/morphic";

describe("it should work", () => {
  let docGenerator: DocGenerator;
  beforeEach(() => {
    docGenerator = new DocGenerator({
      sourceFileName: "classContainer.ts",
      tsConfigFilePath: join(__dirname, "tsconfig.json"),
    });
    docGenerator.addClassByName("classContainer.ts", "Animal");
  });
  test("it works", () => {
    expect(docGenerator.classDocs).toEqual([
      {
        interfaceName: "IBarkProps",
        location:
          "/Users/mike/os/testmorph/src/tests/interfaces/classContainer.ts",
        properties: [
          { name: "toWhom", type: "Person" },
          { name: "age", type: "number" },
        ],
      },
      {
        className: "Person",
        constructors: [
          {
            parameters: [
              { name: "firstname", type: "string" },
              { name: "age", type: "number" },
            ],
          },
        ],
        location:
          "/Users/mike/os/testmorph/src/tests/interfaces/classContainer.ts",
        methods: [],
      },
      {
        className: "Animal",
        constructors: [
          {
            parameters: [
              { name: "name", type: "string" },
              { name: "color", type: "string" },
            ],
          },
        ],
        location:
          "/Users/mike/os/testmorph/src/tests/interfaces/classContainer.ts",
        methods: [
          {
            name: "bark",
            parameters: [{ name: "options", type: "IBarkProps" }],
            returnType: "string",
          },
        ],
      },
    ]);
  });
});
