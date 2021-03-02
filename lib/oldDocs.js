"use strict";
// won't have any though, since `Person` doesn't have a constructor (this would output something for `Place`)
// for (const constructSignatures of paramType.getConstructSignatures()) {
//   console.log("first");
//   console.log(constructSignatures.getParameters().map((p) => p.getName()));
//   console.log(constructSignatures.getReturnType().getText());
// }
// const classDecl = toWhomParam.getType().getSymbol()?.getDeclarations()[0];
// if (Node.isClassDeclaration(classDecl)) {
//   for (const ctor of classDecl.getConstructors()) {
//     for (const param of ctor.getParameters()) {
//       console.log(param.getName());
//     }
//     // console.log(ctor.getText());
//   }
// }
// check the properties (outputs "firstname", then "age")
// for (const prop of paramType.getProperties()) {
//   console.log(prop.getName());
// }
