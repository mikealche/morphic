import { join } from "path";
import { DocGenerator } from "../../morphic";

describe("it should work", () => {
  let docGenerator: DocGenerator;
  beforeEach(() => {
    docGenerator = new DocGenerator({
      sourceFileName: join(__dirname, "classContainer.ts"),
      tsConfigFilePath: "./tsconfig.json",
    });
    docGenerator.addClassByName("Animal");
  });
  test("it works", () => {
    expect(docGenerator.classDocs).toEqual([
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
        methods: [],
      },
      {
        className: "Place",
        constructors: [
          {
            parameters: [
              { name: "lat", type: "123" },
              { name: "lng", type: "543" },
            ],
          },
        ],
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
        methods: [
          {
            name: "bark",
            parameters: [
              { name: "toWhom", type: "Person" },
              { name: "where", type: "Place" },
            ],
            returnType: undefined,
          },
        ],
      },
    ]);
  });
});
