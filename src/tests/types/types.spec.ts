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
        location: "/Users/mike/os/testmorph/src/tests/types/classContainer.ts",
        properties: [
          {
            name: "toWhom",
            type: "Person",
          },
          {
            name: "age",
            type: "number",
          },
        ],
        typeName: "BarkType",
      },
      {
        className: "Animal",
        constructors: [
          {
            parameters: [
              {
                name: "name",
                type: "string",
              },
              {
                name: "color",
                type: "string",
              },
            ],
          },
        ],
        location: "/Users/mike/os/testmorph/src/tests/types/classContainer.ts",
        methods: [
          {
            name: "bark",
            parameters: [
              {
                name: "options",
                type: "BarkType",
              },
            ],
            returnType: undefined,
          },
        ],
      },
    ]);
  });
});
