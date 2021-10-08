import ERCalculator from './ERCalculator';
import ParameterService from './ParameterService';
import ParserService from './ParserService';
import AgeGroup from '../DTOs/AgeGroupDTO';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';
import AgeGroupJSON from '../DTOs/AgeGroupJSON';
import ExtraData from '../DTOs/ExtraDataDTO';

// eslint-disable-next-line max-len
const calculateEnergeticRequirement = async (groups: AgeGroupJSON[], data: ExtraData): Promise<CalculatorResponse> => {
  const parameters = new Map<number[], AgeGroup>();
  const ageGroups = ParserService.parseGroups(groups);

  await Promise.all(ageGroups.map(async (group: AgeGroup) => {
    const arr: number[] = await ParameterService.getEquationValues(group.age, group.sex);
    parameters.set(arr, group);
  }));
  const res: CalculatorResponse = ERCalculator.calculateER(parameters, data);

  return res;
};

export default { calculateEnergeticRequirement };
