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
import ParameterType from '../Enum/ParameterType';

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

const updateGrowthEnergy = async (parameter: EquationConstantDTO): Promise<string> => {
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
  return `Cambió la energía de crecimiento a "${parameter.value}" para individuos de sexo ${parameter.sex} de ${parameter.ageRange}`;
};

const updateBMR = async (parameters: EquationConstantDTO[]): Promise<string> => {
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
    if (!(parameter.order >= 0 && parameter.order <= 1)) {
      throw new Error('Order must be between 0 and 1.');
    }
    orders.push(parameter.order);
  });
  await EquationConstant.bulkCreate(parameters, {
    updateOnDuplicate: ['value'],
  });
  return `Modificó la ecuación TMB a "${parameters[orders.indexOf(0)].value} + ${parameters[orders.indexOf(1)].value}*MP" para individuos de sexo ${parameters[0].sex} de edades en el rango ${parameters[0].ageRange}`;
};

const updateTEE = async (parameters: EquationConstantDTO[]): Promise<string> => {
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
    if (!(parameter.order >= 0 && parameter.order <= 2)) {
      throw new Error('Order must be between 0 and 2.');
    }
    orders.push(parameter.order);
  });

  // build audit message
  let auditMessage = `Modificó la ecuación GET a "${parameters[orders.indexOf(0)].value} + ${parameters[orders.indexOf(1)].value}*MP`;

  // TEE parameters update
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
          if (!(param.order >= 0 && param.order <= 1)) {
            throw new Error('Order must be between 0 and 1.');
          }
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
      auditMessage += `" para los individuos de sexo ${parameters[0].sex} de entre 0 a 5 meses`;
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
          if (!(param.order >= 0 && param.order <= 1)) {
            throw new Error('Order must be between 0 and 1.');
          }
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
      auditMessage += `" para los individuos de sexo ${parameters[0].sex} de entre 6 a 11 meses`;
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
            ageRange: `${i} años` as AgeBracket,
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
      auditMessage += ` + ${parameters[orders.indexOf(2)].value}*MP^2" para los individuos de sexo ${parameters[0].sex} de entre 1 a 17 años`;
      break;
    }
    default: {
      throw new Error(`Age range ${parameters[0].ageRange} does not have TEE constants.`);
    }
  }
  return auditMessage;
};

const updateDefaultWeight = async (parameter: DefaultWeightDTO): Promise<string> => {
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
  return `Cambió el peso a ${parameter.value} para ${parameter.sex} ${parameter.ageRange}`;
};

const updatePercentage = async (params: DefaultExtraDataDTO[], total: number): Promise<string> => {
  if (total === 100) {
    params.forEach((parameter) => {
      if (parameter.order !== 0) {
        throw new Error('Order must be 0');
      }
    });
    DefaultExtraData.bulkCreate(params, {
      updateOnDuplicate: ['value'],
    }).catch((err) => {
      throw err;
    });
  } else {
    throw new Error('Percentages must sum to 100');
  }
  return `Cambió los parámetros prevalencia de actividad física liviana menores a ${params[0].value}, moderada a ${params[1].value} e intensa a ${params[2].value} para menores de entre 6 y 17 años `;
};

const updatePair = async (param: DefaultExtraDataDTO, pairID: string): Promise<string> => {
  if (param.order !== 0) {
    throw new Error('Order must be 0.');
  }
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
  return `Cambió los parámetros porcentuales ${param.id} y ${pairID} a ${param.value}% y ${100 - param.value}% respectivamente, para adultos`;
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

const updateExtraData = async (parameters: DefaultExtraDataDTO[]): Promise<string> => {
  const ids: string[] = [];
  let total = 0;
  let auditMessage = '';

  parameters.forEach((param: DefaultExtraDataDTO) => {
    ids.push(param.id);
    total += param.value;
  });

  if (ids.includes(extraDataIDs.minLowPrev)
  || ids.includes(extraDataIDs.minModPrev)
  || ids.includes(extraDataIDs.minIntPrev)) {
    if (ids.includes(extraDataIDs.minLowPrev)
    && ids.includes(extraDataIDs.minModPrev)
    && ids.includes(extraDataIDs.minIntPrev)) {
      if (ids.length === 3) {
        auditMessage = await updatePercentage(parameters, total);
      } else {
        throw new Error('Too many parameters sent');
      }
    } else {
      throw new Error('Missing parameter for update.');
    }
  } else if (ids.includes(extraDataIDs.urbPopPerc)) {
    auditMessage = await updatePair(parameters[0], extraDataIDs.rurPopPerc);
  } else if (ids.includes(extraDataIDs.rurPopPerc)) {
    auditMessage = await updatePair(parameters[0], extraDataIDs.urbPopPerc);
  } else if (ids.includes(extraDataIDs.urbAdultActPerc)) {
    auditMessage = await updatePair(parameters[0], extraDataIDs.urbAdultLowPerc);
  } else if (ids.includes(extraDataIDs.urbAdultLowPerc)) {
    auditMessage = await updatePair(parameters[0], extraDataIDs.urbAdultActPerc);
  } else if (ids.includes(extraDataIDs.rurAdultActPerc)) {
    auditMessage = await updatePair(parameters[0], extraDataIDs.rurAdultLowPerc);
  } else if (ids.includes(extraDataIDs.rurAdultLowPerc)) {
    auditMessage = await updatePair(parameters[0], extraDataIDs.rurAdultActPerc);
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
      auditMessage = `Cambió el parámetro ${parameters[0].id} a ${parameters[0].value}`;
      if (parameters[0].parameterType === ParameterType.MinorPAL) {
        auditMessage += ' para menores de 6 a 17 años';
      } else if (parameters[0].parameterType === ParameterType.AdultPAL) {
        auditMessage += ' para mayores';
      } else if (parameters[0].parameterType === ParameterType.Maternity) {
        auditMessage += ' para mujeres mayores';
        if (parameters[0].id === 'pregnancyExtraEnergy18to29' || parameters[0].id === 'lactationExtraEnergy18to29') {
          auditMessage += ' de 18 a 29 años';
        } else {
          auditMessage += ' de 30 a 59 años';
        }
      }
    }).catch((err) => {
      throw err;
    });
  } else {
    throw new Error('Invalid parameter ID.');
  }
  return auditMessage;
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
