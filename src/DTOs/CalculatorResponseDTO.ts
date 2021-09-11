import exp from 'constants';
import AgeGroup from '../Models/AgeGroup';
import EnergeticRequirement from '../Models/EnergeticRequirement';

type CalculatorResponseDTO = {
  requerimientosPorGrupo: Map<AgeGroup, EnergeticRequirement>;
  requerimientoTotal: EnergeticRequirement;
};

export default CalculatorResponseDTO;
