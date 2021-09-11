import ERCalculator from './ERCalculator';
import AgeGroup from '../DTOs/AgeGroupDTO';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';

const calculateEnergeticRequirement = (ageGroups: AgeGroup[]): CalculatorResponse => {
  const parametros = new Map<number[], AgeGroup>();
  const params: number[] = [0, 0, 0];
  ageGroups.forEach((group: AgeGroup) => {
    parametros.set(params, group);
  });
  const res: CalculatorResponse = ERCalculator.calculateER(parametros);
  return res;
};

export default { calculateEnergeticRequirement };
