import AgeBracket from '../Enum/AgeBracket';
import ParameterType from '../Enum/ParameterType';
import Sex from '../Enum/Sex';

type EquationConstantDTO = {
  ageRange: AgeBracket;
  value: number;
  sex: Sex;
  parameterType: ParameterType;
  order: number;
  description: string;
};

export default EquationConstantDTO;
