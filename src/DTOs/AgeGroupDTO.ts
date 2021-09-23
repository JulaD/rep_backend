import AgeBracket from '../Enum/AgeBracket';
import Sex from '../Enum/Sex';

type AgeGroup = {
  age: AgeBracket;
  sex: Sex;
  medianWeight: number;
  population: number;
};

export default AgeGroup;
