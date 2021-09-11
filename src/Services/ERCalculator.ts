import AgeGroup from '../Models/AgeGroup';
import EnergeticRequirement from '../Models/EnergeticRequirement';
import CalculatorResponseDTO from '../DTOs/CalculatorResponseDTO';

const calculateER = (groupParameters: Map<number[], AgeGroup>): CalculatorResponseDTO => {
  let totalOfPeople = 0;
  let totalRequirement = 0;

  const requirements = new Map();

  groupParameters.forEach((group: AgeGroup, parameters: number[]) => {
    totalOfPeople = +group.cantidad;

    const requirement = parameters[0]
    + (parameters[1] * group.pesoMediano)
    + (parameters[2] * group.pesoMediano);

    const groupRequirement: EnergeticRequirement = {
      requerimientoEnergeticoPerCapita: requirement,
      requerimientoEnergeticoTotal: requirement * group.cantidad,
    };

    totalRequirement = +groupRequirement.requerimientoEnergeticoTotal;

    requirements.set(group, groupRequirement);
  });

  const totalER: EnergeticRequirement = {
    requerimientoEnergeticoPerCapita: totalRequirement / totalOfPeople,
    requerimientoEnergeticoTotal: totalOfPeople,
  };

  const result: CalculatorResponseDTO = {
    requerimientosPorGrupo: requirements,
    requerimientoTotal: totalER,
  };

  return result;
};

export default { calculateER };
