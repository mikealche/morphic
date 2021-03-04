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
} from "ts-morph";
import { ClassDoc, ConstructorDoc, MethodDoc } from "./global";
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
  public classDocs: ClassDoc[] = [];
  public project: Project;
  private sourceFile?: SourceFile;

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

  addParameterTypeDocs(parameterType: Type<ts.Type>): void {
    if (
      parameterType.isString() ||
      parameterType.isNumber() ||
      parameterType.isBoolean() ||
      parameterType.isLiteral()
    )
      return;

    const parameterTypeName = this.getNameFromParameterType(parameterType);
    if (
      this.classDocs.some(
        (classDoc) => classDoc.className === parameterTypeName
      )
    )
      return;

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
}

// console.log(inspect(docGenerator.classDocs, false, 10000));
