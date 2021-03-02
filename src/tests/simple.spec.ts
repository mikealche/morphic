import { resolve } from "path";
import { DocGenerator } from "../morphic";

describe("it should work", () => {
  let docGenerator: DocGenerator;
  beforeEach(() => {
    console.log("asd", __dirname + "tsconfig.json");
    docGenerator = new DocGenerator({
      sourceFileName: "classContainer.ts",
      tsConfigFilePath: "./tsconfig.json",
    });
    docGenerator.addClassByName("Animal");
  });
  test("works", () => {
    expect(
      expect(docGenerator).toEqual({
        classDocs: [
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
        ],
      })
    );
  });
});
