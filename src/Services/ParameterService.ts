import AgeBracket from '../Enum/AgeBracket';
import Sex from '../Enum/Sex';
// import Parameter from '../Models/Parameter';

const getEquationValues = (ageBracket: AgeBracket, sex: Sex): number[] => {
  let res: number[] = [];
  switch (ageBracket) {
    // Para personas de entre 1 y 5 años
    case (AgeBracket['1 año'] || AgeBracket['2 años'] || AgeBracket['3 años'] || AgeBracket['4 años'] || AgeBracket['5 años']): {
      if (sex === Sex.Masculino) {
        // 310.2 + (63.3*MP) - 0.263*MP^2
        res = [310.2, 63.3, -0.263];
      } else if (sex === Sex.Femenino) {
        // 263.4 + (65.3*MP) - 0.454*MP^2
        res = [263.4, 65.3, -0.454];
      }
      break;
    }
    default: {
      res = [];
    }
  }
  return res;
};

export default { getEquationValues };
