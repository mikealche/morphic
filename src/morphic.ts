import {
  Project,
  Node,
  ts,
  Type,
  ParameterDeclaration,
  ClassDeclaration,
  MethodDeclaration,
  ConstructorDeclaration,
  SourceFile,
  InterfaceDeclaration,
} from "ts-morph";
import { ClassDoc, ConstructorDoc, InterfaceDoc, MethodDoc } from "./global";
import { inspect } from "util";
import { basename, resolve } from "path";

interface DocGeneratorConstrutor {
  tsConfigFilePath: string;
  sourceFileName: string;
}

export interface IDocGenerator {
  new ({
    tsConfigFilePath,
    sourceFileName,
  }: DocGeneratorConstrutor): DocGenerator;
}

export class DocGenerator {
  public classDocs: Array<ClassDoc | InterfaceDoc> = [];
  public project: Project;

  constructor(private options: DocGeneratorConstrutor) {
    const { tsConfigFilePath, sourceFileName } = options;
    this.project = new Project({
      tsConfigFilePath,
    });
  }

  addClassByNameAndSourceFile(sourceFile: SourceFile, className: string) {
    const aClass = sourceFile!.getClassOrThrow(className);
    const methodsDocs = this.generateMethodsDocsForClass(aClass);
    const constructorsDocs = this.generateConstructorsDocsForClass(aClass);
    this.classDocs.push({
      className,
      methods: methodsDocs,
      constructors: constructorsDocs,
      location: this.getFileNameFromSourceFile(sourceFile),
    });
  }

  addClassByName(sourceFileName: string, className: string) {
    const sourceFile = this.project.getSourceFile(sourceFileName);
    if (!sourceFile) {
      throw new Error(`Couldn't find source file for name ${sourceFileName}`);
    }
    return this.addClassByNameAndSourceFile(sourceFile, className);
  }

  generateMethodsDocsForClass(aClass: ClassDeclaration): MethodDoc[] {
    return aClass
      .getMethods()
      .map((method) => this.generateDocsFromMethod(method));
  }

  generateDocsFromMethod(method: MethodDeclaration): MethodDoc {
    const parameters = method
      .getParameters()
      .map((parameter) => this.generateDocsForParameter(parameter));

    return {
      name: method.getName(),
      parameters,
      returnType: method.getReturnType().getSymbol()?.getName()!,
    };
  }

  generateDocsForParameter(parameter: ParameterDeclaration) {
    const parameterType = parameter.getType();
    this.addParameterTypeDocs(parameterType);

    return {
      name: parameter.getName(),
      type: this.getNameFromParameterType(parameterType),
    };
  }

  generateConstructorsDocsForClass(aClass: ClassDeclaration): ConstructorDoc[] {
    return aClass
      .getConstructors()
      .map((constructor) => this.getConstructorDocs(constructor));
  }

  getConstructorDocs(constructor: ConstructorDeclaration): ConstructorDoc {
    const parameters = constructor
      .getParameters()
      .map((parameter) => this.generateDocsForParameter(parameter));

    return { parameters };
  }

  getNameFromParameterType(parameterType: Type<ts.Type>): string {
    return parameterType.getSymbol()?.getName()! || parameterType.getText();
  }

  getFirstDeclarationForParameterType(parameterType: Type<ts.Type>) {
    return parameterType.getSymbol()?.getDeclarations()[0];
  }

  hasClassAlreadyBeenAdded(parameterTypeName: string) {
    return this.classDocs.some(
      (classDoc) => (classDoc as ClassDoc).className === parameterTypeName
    );
  }

  hasInterfaceAlreadyBeenAdded(parameterTypeName: string) {
    return this.classDocs.some(
      (classDoc) =>
        (classDoc as InterfaceDoc).interfaceName === parameterTypeName
    );
  }

  typeWasAlreadyAdded(parameterType: Type<ts.Type>) {
    const parameterTypeName = this.getNameFromParameterType(parameterType);

    if (parameterType.isClass()) {
      if (this.hasClassAlreadyBeenAdded(parameterTypeName)) return true;
    }

    if (parameterType.isInterface()) {
      if (this.hasInterfaceAlreadyBeenAdded(parameterTypeName)) return true;
    }
    return false;
  }

  addParameterTypeDocs(parameterType: Type<ts.Type>): void {
    if (
      parameterType.isString() ||
      parameterType.isNumber() ||
      parameterType.isBoolean() ||
      parameterType.isLiteral()
    )
      return;

    if (parameterType.isInterface()) {
      return this.addInterfaceDocs(parameterType);
    }

    // Class was already added
    const parameterTypeName = this.getNameFromParameterType(parameterType);

    if (this.typeWasAlreadyAdded(parameterType)) return;

    const sourceFile = this.getSourceFileForParameterType(parameterType);
    if (!sourceFile) {
      throw new Error(
        `Couldn't find source file for parameter type ${parameterType}`
      );
    }

    this.addClassByNameAndSourceFile(sourceFile, parameterTypeName);
  }

  getFileNameFromSourceFile(sourceFile: SourceFile) {
    return sourceFile.compilerNode.fileName;
  }

  getSourceFileForParameterType(parameterType: Type<ts.Type>) {
    return parameterType.getSymbol()?.getDeclarations()[0].getSourceFile();
  }

  addInterfaceDocs(interfaceType: Type<ts.Type>) {
    const interfaceDeclaration = this.getFirstDeclarationForParameterType(
      interfaceType
    ) as InterfaceDeclaration;
    const sourceFile = this.getSourceFileForParameterType(interfaceType);
    if (!sourceFile) {
      throw new Error(
        `Couldn't find source file for interface type ${interfaceType}`
      );
    }

    this.classDocs.push({
      interfaceName: interfaceDeclaration.getName(),
      properties: interfaceDeclaration.getProperties().map((prop) => ({
        name: prop.getName(),
        type: prop.getType().getText(),
      })),
      location: this.getFileNameFromSourceFile(sourceFile),
    });

    for (const property of interfaceDeclaration.getProperties()) {
      this.addParameterTypeDocs(property.getType());
    }
  }
}

// console.log(inspect(docGenerator.classDocs, false, 10000));
