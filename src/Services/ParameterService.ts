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

const updateGrowthEnergy = async (parameter: EquationConstantDTO): Promise<void> => {
  await EquationConstant.update(
    { value: parameter.value },
    {
      where: {
        ageRange: parameter.ageRange,
        sex: parameter.sex,
        order: parameter.order,
        parameterType: parameter.parameterType,
      },
    },
  ).then((result) => {
    if (result[0] === 0) {
      throw new Error('No rows were updated.');
    }
  }).catch((err) => {
    throw err;
  });
};

const updateBMR = async (parameters: EquationConstantDTO[]): Promise<void> => {
  const sexo: string = parameters[0].sex;
  const edad: string = parameters[0].ageRange;
  const orders: number[] = [];
  parameters.forEach((parameter) => {
    if (parameter.sex !== sexo || parameter.ageRange !== edad) {
      throw new Error('Parameters sex and age must be the same for all array items.');
    }
    if (parameter.ageRange !== AgeBracket.a18_29
      && parameter.ageRange !== AgeBracket.a30_59
      && parameter.ageRange !== AgeBracket.a60) {
      throw new Error(`Age range ${parameters[0].ageRange} does not have BMR constants.`);
    }
    if (orders.includes(parameter.order)) {
      throw new Error('Order must be different for all array items.');
    }
    orders.push(parameter.order);
  });
  await EquationConstant.bulkCreate(parameters, {
    updateOnDuplicate: ['value'],
  });
};

const updateTEE = async (parameters: EquationConstantDTO[]): Promise<void> => {
  const sexo: string = parameters[0].sex;
  const edad: string = parameters[0].ageRange;
  const orders: number[] = [];
  parameters.forEach((parameter) => {
    if (parameter.sex !== sexo || parameter.ageRange !== edad) {
      throw new Error('Parameters sex and age must be the same for all array items.');
    }
    if (orders.includes(parameter.order)) {
      throw new Error('Order must be different for all array items.');
    }
    orders.push(parameter.order);
  });
  switch (parameters[0].ageRange) {
    case AgeBracket.m0:
    case AgeBracket.m1:
    case AgeBracket.m2:
    case AgeBracket.m3:
    case AgeBracket.m4:
    case AgeBracket.m5: {
      const paramsToUpdate: EquationConstantDTO[] = [];
      for (let i = 0; i <= 5; i += 1) {
        parameters.forEach((param: EquationConstantDTO) => {
          paramsToUpdate.push({
            ageRange: `${i} meses` as AgeBracket,
            order: param.order,
            sex: param.sex,
            value: param.value,
            description: param.description,
            parameterType: param.parameterType,
          });
        });
      }
      await EquationConstant.bulkCreate(paramsToUpdate, {
        updateOnDuplicate: ['value'],
      });
      break;
    }
    case AgeBracket.m6:
    case AgeBracket.m7:
    case AgeBracket.m8:
    case AgeBracket.m9:
    case AgeBracket.m10:
    case AgeBracket.m11: {
      const paramsToUpdate: EquationConstantDTO[] = [];
      for (let i = 6; i <= 11; i += 1) {
        parameters.forEach((param: EquationConstantDTO) => {
          paramsToUpdate.push({
            ageRange: `${i} meses` as AgeBracket,
            order: param.order,
            sex: param.sex,
            value: param.value,
            description: param.description,
            parameterType: param.parameterType,
          });
        });
      }
      await EquationConstant.bulkCreate(paramsToUpdate, {
        updateOnDuplicate: ['value'],
      });
      break;
    }
    case AgeBracket.a1:
    case AgeBracket.a2:
    case AgeBracket.a3:
    case AgeBracket.a4:
    case AgeBracket.a5:
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
      const paramsToUpdate: EquationConstantDTO[] = [];
      for (let i = 1; i <= 17; i += 1) {
        parameters.forEach((param: EquationConstantDTO) => {
          paramsToUpdate.push({
            ageRange: `${i} meses` as AgeBracket,
            order: param.order,
            sex: param.sex,
            value: param.value,
            description: param.description,
            parameterType: param.parameterType,
          });
        });
      }
      await EquationConstant.bulkCreate(paramsToUpdate, {
        updateOnDuplicate: ['value'],
      });
      break;
    }
    default: {
      throw new Error(`Age range ${parameters[0].ageRange} does not have TEE constants.`);
    }
  }
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
  ).then((result) => {
    if (result[0] === 0) {
      throw new Error('No rows were updated.');
    }
  }).catch((err) => {
    throw err;
  });
};

const updatePercentage = async (params: DefaultExtraDataDTO[], total: number): Promise<void> => {
  if (total === 100) {
    // No se mete en un for porque hay problemas con el await
    await DefaultExtraData.update(
      { value: params[0].value },
      {
        where: {
          id: params[0].id,
          parameterType: params[0].parameterType,
        },
        returning: true,
      },
    ).then((result) => {
      if (result[0] === 0) {
        throw new Error('No rows were updated.');
      }
    }).catch((err) => {
      throw err;
    });
    await DefaultExtraData.update(
      { value: params[1].value },
      {
        where: {
          id: params[1].id,
          parameterType: params[1].parameterType,
        },
        returning: true,
      },
    ).then((result) => {
      if (result[0] === 0) {
        throw new Error('No rows were updated.');
      }
    }).catch((err) => {
      throw err;
    });
    await DefaultExtraData.update(
      { value: params[2].value },
      {
        where: {
          id: params[2].id,
          parameterType: params[2].parameterType,
        },
        returning: true,
      },
    ).then((result) => {
      if (result[0] === 0) {
        throw new Error('No rows were updated.');
      }
    }).catch((err) => {
      throw err;
    });
  } else {
    throw new Error('These percentages must add up to 100.');
  }
};

const updatePair = async (param: DefaultExtraDataDTO, pairID: string): Promise<void> => {
  await DefaultExtraData.update(
    { value: param.value },
    {
      where: {
        id: param.id,
        parameterType: param.parameterType,
      },
    },
  ).then((result) => {
    if (result[0] === 0) {
      throw new Error('No rows were updated.');
    }
  }).catch((err) => {
    throw err;
  });
  await DefaultExtraData.update(
    { value: (100 - param.value) },
    {
      where: {
        id: pairID,
        parameterType: param.parameterType,
      },
    },
  ).then((result) => {
    if (result[0] === 0) {
      throw new Error('No rows were updated.');
    }
  }).catch((err) => {
    throw err;
  });
};

const validateID = (id: string): boolean => {
  const keys: string[] = Object.keys(extraDataIDs);
  for (let i = 0; i < keys.length; i += 1) {
    if (extraDataIDs[keys[i]] === id) {
      return true;
    }
  }
  return false;
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
      if (ids.length === 3) {
        await updatePercentage(parameters, total);
      } else {
        throw new Error('Too many parameters sent.');
      }
    } else {
      throw new Error('Missing parameter for update.');
    }
  } else if (ids.includes(extraDataIDs.urbPopPerc)) {
    await updatePair(parameters[0], extraDataIDs.rurPopPerc);
  } else if (ids.includes(extraDataIDs.rurPopPerc)) {
    await updatePair(parameters[0], extraDataIDs.urbPopPerc);
  } else if (ids.includes(extraDataIDs.urbAdultActPerc)) {
    await updatePair(parameters[0], extraDataIDs.urbAdultLowPerc);
  } else if (ids.includes(extraDataIDs.urbAdultLowPerc)) {
    await updatePair(parameters[0], extraDataIDs.urbAdultActPerc);
  } else if (ids.includes(extraDataIDs.rurAdultActPerc)) {
    await updatePair(parameters[0], extraDataIDs.rurAdultLowPerc);
  } else if (ids.includes(extraDataIDs.rurAdultLowPerc)) {
    await updatePair(parameters[0], extraDataIDs.rurAdultActPerc);
  } else if (validateID(parameters[0].id)) {
    await DefaultExtraData.update(
      { value: parameters[0].value },
      {
        where: {
          id: parameters[0].id,
          parameterType: parameters[0].parameterType,
        },
        returning: true,
      },
    ).then((result) => {
      if (result[0] === 0) {
        throw new Error('No rows were updated.');
      }
    }).catch((err) => {
      throw err;
    });
  } else {
    throw new Error('Invalid parameter ID.');
  }
};

export default {
  getEquationValues,
  getDefaultWeights,
  getDefaultExtraData,
  getParameters,
  updateDefaultWeight,
  updateExtraData,
  updateTEE,
  updateBMR,
  updateGrowthEnergy,
};
