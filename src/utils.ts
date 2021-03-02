import { ParameterDeclaration } from "ts-morph";

const typeConstructors: Record<string, string> = {};

export const doWeHaveAWayToBuildIt = (
  parameter: ParameterDeclaration
): boolean => {
  const parameterType = parameter.getType();
  if (
    parameterType.isString() ||
    parameterType.isNumber() ||
    parameterType.isBoolean() ||
    parameterType.isLiteral()
  )
    return true;

  if (parameterType.isClass())
    return Boolean(typeConstructors[parameterType.getText()]);

  throw new Error(
    `Forgot to add case for this param type ${parameterType.getText()}`
  );
};
