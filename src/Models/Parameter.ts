import ParameterType from '../Enum/ParameterType';

class Parameter {
  name: string;

  value: number;

  parameterType: ParameterType;

  constructor(name: string, value: number, parameterType: ParameterType) {
    this.name = name;
    this.value = value;
    this.parameterType = parameterType;
  }
}

export default Parameter;
