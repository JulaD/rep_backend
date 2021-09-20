import ERCalculator from './ERCalculator';
import ParameterService from './ParameterService';
import ParserService from './ParserService';
import AgeGroup from '../DTOs/AgeGroupDTO';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';
import AgeGroupJSON from '../DTOs/AgeGroupJSON';
import ExtraData from '../DTOs/ExtraDataDTO';

// eslint-disable-next-line max-len
const calculateEnergeticRequirement = (groups: AgeGroupJSON[], data: ExtraData): CalculatorResponse => {
  const parameters = new Map<number[], AgeGroup>();
  const ageGroups = ParserService.parseGroups(groups);
  ageGroups.forEach((group: AgeGroup) => {
    parameters.set(ParameterService.getEquationValues(group.age, group.sex), group);
  });

  const res: CalculatorResponse = ERCalculator.calculateER(parameters, data);

  return res;
};

export default { calculateEnergeticRequirement };
