"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var morphic_1 = require("../morphic");
describe("it should work", function () {
    var docGenerator;
    beforeEach(function () {
        console.log("asd", __dirname + "tsconfig.json");
        docGenerator = new morphic_1.DocGenerator({
            sourceFileName: "classContainer.ts",
            tsConfigFilePath: "./tsconfig.json",
        });
        docGenerator.addClassByName("Animal");
    });
    test("works", function () {
        expect(expect(docGenerator).toEqual({
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
        }));
    });
});
