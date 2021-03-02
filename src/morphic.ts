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
import { resolve } from "path";

// const project = new Project({
//   tsConfigFilePath: "./tsconfig.json",
// });

// const sourceFile = project.getSourceFile("index.ts");
// const animalClass = sourceFile!.getClassOrThrow("Animal");
// const barkMethod = animalClass.getMethodOrThrow("bark");
// const toWhomParam = barkMethod.getParameterOrThrow("toWhom");

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
  private project: Project;
  private sourceFile?: SourceFile;

  constructor(private options: DocGeneratorConstrutor) {
    const { tsConfigFilePath, sourceFileName } = options;
    this.project = new Project({
      tsConfigFilePath: tsConfigFilePath,
    });
    this.sourceFile = this.project.getSourceFile(sourceFileName);
  }

  addClassByName(className: string) {
    const aClass = this.sourceFile!.getClassOrThrow(className);
    const methodsDocs = this.generateMethodsDocsForClass(aClass);
    const constructorsDocs = this.generateConstructorsDocsForClass(aClass);
    this.classDocs.push({
      className,
      methods: methodsDocs,
      constructors: constructorsDocs,
    });
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

    this.addClassByName(parameterTypeName);
  }
}

// console.log(inspect(docGenerator.classDocs, false, 10000));
