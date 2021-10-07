import AgeBracket from '../Enum/AgeBracket';
import Sex from '../Enum/Sex';

type DefaultWeightDTO = {
  value: number;
  ageRange: AgeBracket;
  sex: Sex;
};

export default DefaultWeightDTO;
