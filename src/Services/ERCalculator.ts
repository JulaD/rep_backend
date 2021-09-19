import AgeGroup from '../DTOs/AgeGroupDTO';
import EnergeticRequirement from '../DTOs/EnergeticRequirementDTO';
import CalculatorResponse from '../DTOs/CalculatorResponseDTO';
import GroupEnergeticRequirement from '../DTOs/GroupEnergeticRequirementDTO';
import extraData from '../DTOs/ExtraDataDTO';
import MinorPALDTO from '../DTOs/MinorPALDTO';
import ParserService from './ParserService';
import AgeBracket from '../Enum/AgeBracket';

const calculateGET = (group: AgeGroup, params: number[], preval: MinorPALDTO): number => {
  const getModerate: number = params[0]
  + (params[1] * group.medianWeight)
  - params[2] * (group.medianWeight * group.medianWeight);

  const getLow: number = getModerate - (getModerate * params[4]) / 100;
  const getIntense: number = getModerate + (getModerate * params[5]) / 100;

  const ret: number = (getLow * preval.lowPalPrevalence) / 100
  + (getModerate * preval.moderatePALPrevalence) / 100
  + (getIntense * preval.intensePALPrevalence) / 100;

  return ret;
};

const calculateLessThanAYear = (group: AgeGroup, params: number[]): GroupEnergeticRequirement => {
  const requirement = params[0] + (params[1] * group.medianWeight) + params[2];

  const groupRequirement: GroupEnergeticRequirement = {
    group: ParserService.unparseGroup(group),
    perCapita: requirement,
    total: requirement * group.population,
  };

  return groupRequirement;
};

const calculateOneToFiveYears = (group: AgeGroup, params: number[]): GroupEnergeticRequirement => {
  const requirement = params[0]
  + (params[1] * group.medianWeight)
  + (params[2] * (group.medianWeight ** 2))
  + params[3];

  const groupRequirement: GroupEnergeticRequirement = {
    group: ParserService.unparseGroup(group),
    perCapita: requirement,
    total: requirement * group.population,
  };

  return groupRequirement;
};

// eslint-disable-next-line max-len
const calculateSixToSeventeenYears = (group: AgeGroup, params: number[], data: extraData): GroupEnergeticRequirement => {
  let get: number;
  if (typeof (data.minorPAL) === 'undefined') {
    throw new Error('Data missing');
  } else {
    get = calculateGET(group, params, data.minorPAL);
  }

  const requirement = get + params[3];

  const groupRequirement: GroupEnergeticRequirement = {
    group: ParserService.unparseGroup(group),
    perCapita: requirement,
    total: requirement * group.population,
  };

  return groupRequirement;
};

// eslint-disable-next-line max-len
const calculateER = (groupParameters: Map<number[], AgeGroup>, data: extraData): CalculatorResponse => {
  let totalOfPeople = 0;
  let totalRequirement = 0;

  const requirements: GroupEnergeticRequirement[] = [];

  groupParameters.forEach((group: AgeGroup, params: number[]) => {
    totalOfPeople += group.population;
    let groupRequirement: GroupEnergeticRequirement;
    switch (group.age) {
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
    totalRequirement += groupRequirement.total;
    requirements.push(groupRequirement);
  });

  const totalER: EnergeticRequirement = {
    perCapita: totalRequirement / totalOfPeople,
    total: totalRequirement,
    totalPopulation: totalOfPeople,
  };

  const result: CalculatorResponse = {
    groupsRequirements: requirements,
    totalRequirement: totalER,
  };

  return result;
};

export default { calculateER };
