import AgeBracket from '../Enum/AgeBracket';
import ParameterType from '../Enum/ParameterType';
import Sex from '../Enum/Sex';

type DefaultWeightDTO = {
  value: number;
  ageRange: AgeBracket;
  sex: Sex;
  parameterType: ParameterType;
};

export default DefaultWeightDTO;
