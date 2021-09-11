import AgeGroup from './AgeGroupDTO';
import EnergeticRequirement from './EnergeticRequirementDTO';

type CalculatorResponse = {
  requerimientosPorGrupo: Map<AgeGroup, EnergeticRequirement>;
  requerimientoTotal: EnergeticRequirement;
};

export default CalculatorResponse;
