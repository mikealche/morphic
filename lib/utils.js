"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doWeHaveAWayToBuildIt = void 0;
var typeConstructors = {};
var doWeHaveAWayToBuildIt = function (parameter) {
    var parameterType = parameter.getType();
    if (parameterType.isString() ||
        parameterType.isNumber() ||
        parameterType.isBoolean() ||
        parameterType.isLiteral())
        return true;
    if (parameterType.isClass())
        return Boolean(typeConstructors[parameterType.getText()]);
    throw new Error("Forgot to add case for this param type " + parameterType.getText());
};
exports.doWeHaveAWayToBuildIt = doWeHaveAWayToBuildIt;
