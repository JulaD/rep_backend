import { Op } from 'sequelize';
import DefaultExtraDataDTO from '../DTOs/DefaultExtraDataDTO';
import EquationConstantDTO from '../DTOs/EquationConstantDTO';
import AgeBracket from '../Enum/AgeBracket';
import Sex from '../Enum/Sex';
import ParameterMapper from '../Mappers/ParameterMapper';
import DefaultExtraData from '../Models/DefaultExtraData';
import EquationConstant from '../Models/EquationConstant';
import DefaultWeight from '../Models/DefaultWeight';
import DefaultWeightDTO from '../DTOs/DefaultWeightDTO';
import ParameterWrapperDTO from '../DTOs/ParameterWrapperDTO';
import { extraDataIDs } from '../Config/Constants';

const pushExtraData = (rows: DefaultExtraData[], arr: number[]): void => {
  rows.forEach((row: DefaultExtraData) => {
    const constant: DefaultExtraDataDTO = ParameterMapper.defaultExtraDataToDTO(row);
    arr.push(constant.value);
  });
};

const getEquationValues = async (ageBracket: AgeBracket, sex: Sex): Promise<number[]> => {
  const res: number[] = [];
  await EquationConstant.findAll({
    where: {
      ageRange: ageBracket as string,
      sex: sex as string,
    },
    order: [['order', 'ASC']],
  })
    .then((rows: EquationConstant[]) => {
      rows.forEach((row: EquationConstant) => {
        const constant: EquationConstantDTO = ParameterMapper.equationConstantToDTO(row);
        res.push(constant.value);
      });
    });
  switch (ageBracket) {
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
      await DefaultExtraData.findAll({
        where: {
          parameterType: 'NAF Menores',
          order: [1, 2],
        },
        order: [['order', 'ASC']],
      })
        .then((rows: DefaultExtraData[]) => {
          pushExtraData(rows, res);
        });
      break;
    }
    case AgeBracket.a18_29: {
      if (sex === Sex.Female) {
        await DefaultExtraData.findAll({
          where: {
            [Op.or]: [
              { parameterType: 'NAF Adultos' },
              {
                id: ['pregnancyExtraEnergy18to29', 'lactationExtraEnergy18to29'],
              },
            ],
            order: {
              [Op.gt]: 0,
            },
          },
          order: [['order', 'ASC']],
        })
          .then((rows: DefaultExtraData[]) => {
            pushExtraData(rows, res);
          });
      } else {
        await DefaultExtraData.findAll({
          where: {
            parameterType: 'NAF Adultos',
            order: {
              [Op.gt]: 0,
            },
          },
          order: [['order', 'ASC']],
        })
          .then((rows: DefaultExtraData[]) => {
            pushExtraData(rows, res);
          });
      }
      break;
    }
    case AgeBracket.a30_59: {
      if (sex === Sex.Female) {
        await DefaultExtraData.findAll({
          where: {
            [Op.or]: [
              { parameterType: 'NAF Adultos' },
              {
                id: ['pregnancyExtraEnergy30to59', 'lactationExtraEnergy30to59'],
              },
            ],
            order: {
              [Op.gt]: 0,
            },
          },
          order: [['order', 'ASC']],
        })
          .then((rows: DefaultExtraData[]) => {
            pushExtraData(rows, res);
          });
      } else {
        await DefaultExtraData.findAll({
          where: {
            parameterType: 'NAF Adultos',
            order: {
              [Op.gt]: 0,
            },
          },
          order: [['order', 'ASC']],
        })
          .then((rows: DefaultExtraData[]) => {
            pushExtraData(rows, res);
          });
      }
      break;
    }
    case AgeBracket.a60: {
      await DefaultExtraData.findAll({
        where: {
          parameterType: 'NAF Adultos',
          order: {
            [Op.gt]: 0,
          },
        },
        order: [['order', 'ASC']],
      })
        .then((rows: DefaultExtraData[]) => {
          pushExtraData(rows, res);
        });
      break;
    }
    default: {
      break;
    }
  }
  return res;
};

const getDefaultWeights = async (): Promise<DefaultWeightDTO[]> => {
  const res: DefaultWeightDTO[] = [];
  await DefaultWeight.findAll().then((parameters: DefaultWeight[]) => {
    parameters.forEach((param: DefaultWeight) => {
      res.push(ParameterMapper.defaultWeightToDTO(param));
    });
  });
  return res;
};

const getDefaultExtraData = async (): Promise<DefaultExtraDataDTO[]> => {
  const res: DefaultExtraDataDTO[] = [];
  await DefaultExtraData.findAll({
    where: {
      order: 0,
    },
  }).then((parameters: DefaultExtraData[]) => {
    parameters.forEach((param: DefaultExtraData) => {
      res.push(ParameterMapper.defaultExtraDataToDTO(param));
    });
  });
  return res;
};

const getParameters = async (): Promise<ParameterWrapperDTO> => {
  const extraData: DefaultExtraDataDTO[] = [];
  await DefaultExtraData.findAll().then((parameters: DefaultExtraData[]) => {
    parameters.forEach((param: DefaultExtraData) => {
      extraData.push(ParameterMapper.defaultExtraDataToDTO(param));
    });
  });
  const equationConstant: EquationConstantDTO[] = [];
  await EquationConstant.findAll().then((parameters: EquationConstant[]) => {
    parameters.forEach((param: EquationConstant) => {
      equationConstant.push(ParameterMapper.equationConstantToDTO(param));
    });
  });
  const defaultWeight: DefaultWeightDTO[] = await getDefaultWeights();
  const res: ParameterWrapperDTO = {
    equationConstants: equationConstant,
    defaultWeights: defaultWeight,
    defaultExtraData: extraData,
  };
  return res;
};

const updateEquationConstant = async (parameter: EquationConstantDTO): Promise<void> => {
  await EquationConstant.update(
    { value: parameter.value },
    {
      where: {
        ageRange: parameter.ageRange,
        sex: parameter.sex,
        order: parameter.order,
      },
    },
  ).catch((err) => {
    throw err;
  });
};

const updateDefaultWeight = async (parameter: DefaultWeightDTO): Promise<void> => {
  await DefaultWeight.update(
    { value: parameter.value },
    {
      where: {
        ageRange: parameter.ageRange,
        sex: parameter.sex,
      },
    },
  ).catch((err) => {
    throw err;
  });
};

const updatePercentage = async (params: DefaultExtraDataDTO[], total: number): Promise<void> => {
  if (total === 100) {
    params.forEach(async (param: DefaultExtraDataDTO) => {
      await DefaultExtraData.update(
        { value: param.value },
        {
          where: {
            id: param.id,
          },
        },
      ).catch((err) => {
        throw err;
      });
    });
  } else {
    throw new Error('These percentages must add up to 100');
  }
};

const updatePair = async (param: DefaultExtraDataDTO, pairID: string): Promise<void> => {
  await DefaultExtraData.update(
    { value: param.value },
    {
      where: {
        id: param.id,
      },
    },
  ).catch((err) => {
    throw err;
  });
  await DefaultExtraData.update(
    { value: (100 - param.value) },
    {
      where: {
        id: pairID,
      },
    },
  ).catch((err) => {
    throw err;
  });
};

const updateExtraData = async (parameters: DefaultExtraDataDTO[]): Promise<void> => {
  const ids: string[] = [];
  let total = 0;

  parameters.forEach((param: DefaultExtraDataDTO) => {
    ids.push(param.id);
    total += param.value;
  });

  if (ids.includes(extraDataIDs.minLowPrev)) {
    if (ids.includes(extraDataIDs.minModPrev) && ids.includes(extraDataIDs.minIntPrev)) {
      updatePercentage(parameters, total);
    } else {
      throw new Error('Missing parameter for update');
    }
  } else if (ids.includes(extraDataIDs.urbPopPerc)) {
    updatePair(parameters[0], extraDataIDs.rurPopPerc);
  } else if (ids.includes(extraDataIDs.rurPopPerc)) {
    updatePair(parameters[0], extraDataIDs.urbPopPerc);
  } else if (ids.includes(extraDataIDs.urbAdultActPerc)) {
    updatePair(parameters[0], extraDataIDs.urbAdultLowPerc);
  } else if (ids.includes(extraDataIDs.urbAdultLowPerc)) {
    updatePair(parameters[0], extraDataIDs.urbAdultActPerc);
  } else if (ids.includes(extraDataIDs.rurAdultActPerc)) {
    updatePair(parameters[0], extraDataIDs.rurAdultLowPerc);
  } else if (ids.includes(extraDataIDs.rurAdultLowPerc)) {
    updatePair(parameters[0], extraDataIDs.rurAdultActPerc);
  } else {
    await DefaultExtraData.update(
      { value: parameters[0].value },
      {
        where: {
          id: parameters[0].id,
        },
      },
    ).catch((err) => {
      throw err;
    });
  }
};

export default {
  getEquationValues,
  getDefaultWeights,
  getDefaultExtraData,
  getParameters,
  updateEquationConstant,
  updateDefaultWeight,
  updateExtraData,
};
