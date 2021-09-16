import AgeGroup from '../DTOs/AgeGroupDTO';
import EnergeticRequirement from '../DTOs/EnergeticRequirementDTO';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';
import GroupEnergeticRequirement from '../DTOs/GroupEnergeticRequirementDTO';
import ParserService from './ParserService';
import AgeBracket from '../Enum/AgeBracket';

const calculateLessThanAYear = (group: AgeGroup, params: number[]): GroupEnergeticRequirement => {
  const requirement = params[0] + (params[1] * group.pesoMediano) + params[2];

  const groupRequirement: GroupEnergeticRequirement = {
    grupoEtario: ParserService.unparseGroup(group),
    requerimientoEnergeticoPerCapita: requirement,
    requerimientoEnergeticoTotal: requirement * group.cantidad,
  };

  return groupRequirement;
};

const calculateOneToFiveYears = (group: AgeGroup, params: number[]): GroupEnergeticRequirement => {
  const requirement = params[0]
  + (params[1] * group.pesoMediano)
  + (params[2] * (group.pesoMediano ** 2))
  + params[3];

  const groupRequirement: GroupEnergeticRequirement = {
    grupoEtario: ParserService.unparseGroup(group),
    requerimientoEnergeticoPerCapita: requirement,
    requerimientoEnergeticoTotal: requirement * group.cantidad,
  };

  return groupRequirement;
};

const calculateER = (groupParameters: Map<number[], AgeGroup>): CalculatorResponse => {
  let totalOfPeople = 0;
  let totalRequirement = 0;

  const requirements: GroupEnergeticRequirement[] = [];

  groupParameters.forEach((group: AgeGroup, params: number[]) => {
    totalOfPeople += group.cantidad;
    let groupRequirement: GroupEnergeticRequirement;
    switch (group.edad) {
      case AgeBracket.m0:
      case AgeBracket.m1:
      case AgeBracket.m2:
      case AgeBracket.m3:
      case AgeBracket.m4:
      case AgeBracket.m5:
      case AgeBracket.m6:
      case AgeBracket.m7:
      case AgeBracket.m8:
      case AgeBracket.m9:
      case AgeBracket.m10:
      case AgeBracket.m11: {
        groupRequirement = calculateLessThanAYear(group, params);
        break;
      }
      case AgeBracket.a1:
      case AgeBracket.a2:
      case AgeBracket.a3:
      case AgeBracket.a4:
      case AgeBracket.a5: {
        groupRequirement = calculateOneToFiveYears(group, params);
        break;
      }
      default: {
        throw new Error('Parsing error, attribute edad does not respect format');
      }
    }
    totalRequirement += groupRequirement.requerimientoEnergeticoTotal;
    requirements.push(groupRequirement);
  });

  const totalER: EnergeticRequirement = {
    requerimientoEnergeticoPerCapita: totalRequirement / totalOfPeople,
    requerimientoEnergeticoTotal: totalRequirement,
    poblacionTotal: totalOfPeople,
  };

  const result: CalculatorResponse = {
    requerimientosPorGrupo: requirements,
    requerimientoTotal: totalER,
  };

  return result;
};

export default { calculateER };
