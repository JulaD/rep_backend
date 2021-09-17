import EnergeticRequirement from './EnergeticRequirementDTO';
import GroupEnergeticRequirement from './GroupEnergeticRequirementDTO';

type CalculatorResponse = {
  requerimientosPorGrupo: GroupEnergeticRequirement[];
  requerimientoTotal: EnergeticRequirement;
};

export default CalculatorResponse;
