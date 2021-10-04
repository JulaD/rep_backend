import EnergeticRequirement from './EnergeticRequirementDTO';
import GroupEnergeticRequirement from './GroupEnergeticRequirementDTO';

type CalculatorResponse = {
  groupsRequirements: GroupEnergeticRequirement[];
  totalRequirement: EnergeticRequirement;
};

export default CalculatorResponse;
