import AgeBracket from '../Enum/AgeBracket';
import Sex from '../Enum/Sex';

type AgeGroup = {
  edad: AgeBracket;
  sexo: Sex;
  pesoMediano: number;
  cantidad: number;
};

export default AgeGroup;
