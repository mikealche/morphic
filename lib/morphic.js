"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocGenerator = void 0;
var ts_morph_1 = require("ts-morph");
var DocGenerator = /** @class */ (function () {
    function DocGenerator(options) {
        this.options = options;
        this.classDocs = [];
        var tsConfigFilePath = options.tsConfigFilePath, sourceFileName = options.sourceFileName;
        this.project = new ts_morph_1.Project({
            tsConfigFilePath: tsConfigFilePath,
        });
        this.sourceFile = this.project.getSourceFile(sourceFileName);
    }
    DocGenerator.prototype.addClassByName = function (className) {
        var aClass = this.sourceFile.getClassOrThrow(className);
        var methodsDocs = this.generateMethodsDocsForClass(aClass);
        var constructorsDocs = this.generateConstructorsDocsForClass(aClass);
        this.classDocs.push({
            className: className,
            methods: methodsDocs,
            constructors: constructorsDocs,
        });
    };
    DocGenerator.prototype.generateMethodsDocsForClass = function (aClass) {
        var _this = this;
        return aClass
            .getMethods()
            .map(function (method) { return _this.generateDocsFromMethod(method); });
    };
    DocGenerator.prototype.generateDocsFromMethod = function (method) {
        var _this = this;
        var _a;
        var parameters = method
            .getParameters()
            .map(function (parameter) { return _this.generateDocsForParameter(parameter); });
        return {
            name: method.getName(),
            parameters: parameters,
            returnType: (_a = method.getReturnType().getSymbol()) === null || _a === void 0 ? void 0 : _a.getName(),
        };
    };
    DocGenerator.prototype.generateDocsForParameter = function (parameter) {
        var parameterType = parameter.getType();
        this.addParameterTypeDocs(parameterType);
        return {
            name: parameter.getName(),
            type: this.getNameFromParameterType(parameterType),
        };
    };
    DocGenerator.prototype.generateConstructorsDocsForClass = function (aClass) {
        var _this = this;
        return aClass
            .getConstructors()
            .map(function (constructor) { return _this.getConstructorDocs(constructor); });
    };
    DocGenerator.prototype.getConstructorDocs = function (constructor) {
        var _this = this;
        var parameters = constructor
            .getParameters()
            .map(function (parameter) { return _this.generateDocsForParameter(parameter); });
        return { parameters: parameters };
    };
    DocGenerator.prototype.getNameFromParameterType = function (parameterType) {
        var _a;
        return ((_a = parameterType.getSymbol()) === null || _a === void 0 ? void 0 : _a.getName()) || parameterType.getText();
    };
    DocGenerator.prototype.addParameterTypeDocs = function (parameterType) {
        if (parameterType.isString() ||
            parameterType.isNumber() ||
            parameterType.isBoolean() ||
            parameterType.isLiteral())
            return;
        var parameterTypeName = this.getNameFromParameterType(parameterType);
        if (this.classDocs.some(function (classDoc) { return classDoc.className === parameterTypeName; }))
            return;
        this.addClassByName(parameterTypeName);
    };
    return DocGenerator;
}());
exports.DocGenerator = DocGenerator;
// console.log(inspect(docGenerator.classDocs, false, 10000));
