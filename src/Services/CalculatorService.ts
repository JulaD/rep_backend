import ERCalculator from './ERCalculator';
import ParameterService from './ParameterService';
import ParserService from './ParserService';
import AgeGroup from '../DTOs/AgeGroupDTO';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';
import AgeGroupJSON from '../DTOs/AgeGroupJSON';
import extraData from '../DTOs/ExtraDataDTO';

// eslint-disable-next-line max-len
const calculateEnergeticRequirement = (groups: AgeGroupJSON[], data: extraData): CalculatorResponse => {
  const parametros = new Map<number[], AgeGroup>();
  const ageGroups = ParserService.parseGroups(groups);
  ageGroups.forEach((group: AgeGroup) => {
    parametros.set(ParameterService.getEquationValues(group.edad, group.sexo), group);
  });

  const res: CalculatorResponse = ERCalculator.calculateER(parametros, data);

  return res;
};

export default { calculateEnergeticRequirement };
