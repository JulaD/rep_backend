import ERCalculator from './ERCalculator';
import ParameterService from './ParameterService';
import ParserService from './ParserService';
import AgeGroup from '../DTOs/AgeGroupDTO';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';
import AgeGroupJSON from '../DTOs/AgeGroupJSON';

const calculateEnergeticRequirement = (data: AgeGroupJSON[]): CalculatorResponse => {
  const parametros = new Map<number[], AgeGroup>();
  const ageGroups = ParserService.parseGroups(data);
  ageGroups.forEach((group: AgeGroup) => {
    parametros.set(ParameterService.getEquationValues(group.edad, group.sexo), group);
  });

  const res: CalculatorResponse = ERCalculator.calculateER(parametros);

  return res;
};

export default { calculateEnergeticRequirement };
