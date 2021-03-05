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
    }
    DocGenerator.prototype.addClassByNameAndSourceFile = function (sourceFile, className) {
        var aClass = sourceFile.getClassOrThrow(className);
        var methodsDocs = this.generateMethodsDocsForClass(aClass);
        var constructorsDocs = this.generateConstructorsDocsForClass(aClass);
        this.classDocs.push({
            className: className,
            methods: methodsDocs,
            constructors: constructorsDocs,
            location: this.getFileNameFromSourceFile(sourceFile),
        });
    };
    DocGenerator.prototype.addClassByName = function (sourceFileName, className) {
        var sourceFile = this.project.getSourceFile(sourceFileName);
        if (!sourceFile) {
            throw new Error("Couldn't find source file for name " + sourceFileName);
        }
        return this.addClassByNameAndSourceFile(sourceFile, className);
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
    DocGenerator.prototype.getFirstDeclarationForParameterType = function (parameterType) {
        var _a;
        return (_a = parameterType.getSymbol()) === null || _a === void 0 ? void 0 : _a.getDeclarations()[0];
    };
    DocGenerator.prototype.hasClassAlreadyBeenAdded = function (parameterTypeName) {
        return this.classDocs.some(function (classDoc) { return classDoc.className === parameterTypeName; });
    };
    DocGenerator.prototype.hasInterfaceAlreadyBeenAdded = function (parameterTypeName) {
        return this.classDocs.some(function (classDoc) {
            return classDoc.interfaceName === parameterTypeName;
        });
    };
    DocGenerator.prototype.typeWasAlreadyAdded = function (parameterType) {
        var parameterTypeName = this.getNameFromParameterType(parameterType);
        if (parameterType.isClass()) {
            if (this.hasClassAlreadyBeenAdded(parameterTypeName))
                return true;
        }
        if (parameterType.isInterface()) {
            if (this.hasInterfaceAlreadyBeenAdded(parameterTypeName))
                return true;
        }
        return false;
    };
    DocGenerator.prototype.addParameterTypeDocs = function (parameterType) {
        if (parameterType.isString() ||
            parameterType.isNumber() ||
            parameterType.isBoolean() ||
            parameterType.isLiteral())
            return;
        if (parameterType.isInterface()) {
            return this.addInterfaceDocs(parameterType);
        }
        // Class was already added
        var parameterTypeName = this.getNameFromParameterType(parameterType);
        if (this.typeWasAlreadyAdded(parameterType))
            return;
        var sourceFile = this.getSourceFileForParameterType(parameterType);
        if (!sourceFile) {
            throw new Error("Couldn't find source file for parameter type " + parameterType);
        }
        this.addClassByNameAndSourceFile(sourceFile, parameterTypeName);
    };
    DocGenerator.prototype.getFileNameFromSourceFile = function (sourceFile) {
        return sourceFile.compilerNode.fileName;
    };
    DocGenerator.prototype.getSourceFileForParameterType = function (parameterType) {
        var _a;
        return (_a = parameterType.getSymbol()) === null || _a === void 0 ? void 0 : _a.getDeclarations()[0].getSourceFile();
    };
    DocGenerator.prototype.addInterfaceDocs = function (interfaceType) {
        var interfaceDeclaration = this.getFirstDeclarationForParameterType(interfaceType);
        var sourceFile = this.getSourceFileForParameterType(interfaceType);
        if (!sourceFile) {
            throw new Error("Couldn't find source file for interface type " + interfaceType);
        }
        this.classDocs.push({
            interfaceName: interfaceDeclaration.getName(),
            properties: interfaceDeclaration.getProperties().map(function (prop) { return ({
                name: prop.getName(),
                type: prop.getType().getText(),
            }); }),
            location: this.getFileNameFromSourceFile(sourceFile),
        });
        for (var _i = 0, _a = interfaceDeclaration.getProperties(); _i < _a.length; _i++) {
            var property = _a[_i];
            this.addParameterTypeDocs(property.getType());
        }
    };
    return DocGenerator;
}());
exports.DocGenerator = DocGenerator;
// console.log(inspect(docGenerator.classDocs, false, 10000));
