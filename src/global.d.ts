export interface ConstructorDoc {
  parameters: ParameterDoc[];
}

export interface ParameterDoc {
  name: string;
  type: string;
}

export interface MethodDoc {
  name: string;
  parameters: ParameterDoc[];
  returnType: string;
}

export interface ClassDoc {
  className: string;
  methods: MethodDoc[];
  constructors: ConstructorDoc[];
  location: string;
}
