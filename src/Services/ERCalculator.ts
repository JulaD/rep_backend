import AgeGroup from '../DTOs/AgeGroupDTO';
import EnergeticRequirement from '../DTOs/EnergeticRequirementDTO';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';
import GroupEnergeticRequirement from '../DTOs/GroupEnergeticRequirementDTO';
import extraData from '../DTOs/ExtraDataDTO';
import prevalenciaAFMenores from '../DTOs/MinorPALDTO';
import ParserService from './ParserService';
import AgeBracket from '../Enum/AgeBracket';

const calculateGET = (group: AgeGroup, params: number[], preval: prevalenciaAFMenores): number => {
  const getModerado: number = params[0]
  + (params[1] * group.pesoMediano)
  - params[2] * (group.pesoMediano * group.pesoMediano);

  const getLiviano: number = getModerado - (getModerado * params[4]) / 100;
  const getIntenso: number = getModerado + (getModerado * params[5]) / 100;

  const ret: number = (getLiviano * preval.NAFLiviano) / 100
  + (getModerado * preval.NAFModerado) / 100
  + (getIntenso * preval.NAFIntenso) / 100;

  return ret;
};

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

// eslint-disable-next-line max-len
const calculateSixToSeventeenYears = (group: AgeGroup, params: number[], data: extraData): GroupEnergeticRequirement => {
  let get: number;
  if (typeof (data.prevalenciaAFMenores) === 'undefined') {
    throw new Error('Data missing');
  } else {
    get = calculateGET(group, params, data.prevalenciaAFMenores);
  }

  const requirement = get + params[3];

  const groupRequirement: GroupEnergeticRequirement = {
    grupoEtario: ParserService.unparseGroup(group),
    requerimientoEnergeticoPerCapita: requirement,
    requerimientoEnergeticoTotal: requirement * group.cantidad,
  };

  return groupRequirement;
};

// eslint-disable-next-line max-len
const calculateER = (groupParameters: Map<number[], AgeGroup>, data: extraData): CalculatorResponse => {
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
      case AgeBracket.a6:
      case AgeBracket.a7:
      case AgeBracket.a8:
      case AgeBracket.a9:
      case AgeBracket.a10:
      case AgeBracket.a11:
      case AgeBracket.a12:
      case AgeBracket.a13:
      case AgeBracket.a14:
      case AgeBracket.a15:
      case AgeBracket.a16:
      case AgeBracket.a17: {
        groupRequirement = calculateSixToSeventeenYears(group, params, data);
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
