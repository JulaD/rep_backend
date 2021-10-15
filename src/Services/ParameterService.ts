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
          rows.forEach((row: DefaultExtraData) => {
            const constant: DefaultExtraDataDTO = ParameterMapper.defaultExtraDataToDTO(row);
            res.push(constant.value);
          });
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
            rows.forEach((row: DefaultExtraData) => {
              const constant: DefaultExtraDataDTO = ParameterMapper.defaultExtraDataToDTO(row);
              res.push(constant.value);
            });
          });
        console.log(res);
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
            rows.forEach((row: DefaultExtraData) => {
              const constant: DefaultExtraDataDTO = ParameterMapper.defaultExtraDataToDTO(row);
              res.push(constant.value);
            });
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
            rows.forEach((row: DefaultExtraData) => {
              const constant: DefaultExtraDataDTO = ParameterMapper.defaultExtraDataToDTO(row);
              res.push(constant.value);
            });
          });
        console.log(res);
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
            rows.forEach((row: DefaultExtraData) => {
              const constant: DefaultExtraDataDTO = ParameterMapper.defaultExtraDataToDTO(row);
              res.push(constant.value);
            });
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
          rows.forEach((row: DefaultExtraData) => {
            const constant: DefaultExtraDataDTO = ParameterMapper.defaultExtraDataToDTO(row);
            res.push(constant.value);
          });
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

const updateEquationConstant = async (age: AgeBracket, s: Sex, ord: number, val: number):
Promise<void> => {
  await EquationConstant.update(
    { value: val },
    {
      where: {
        ageRange: age,
        sex: s,
        order: ord,
      },
    },
  ).catch((err) => {
    throw err;
  });
};

const updateDefaultWeight = async (age: AgeBracket, s: Sex, val: number): Promise<void> => {
  await DefaultWeight.update(
    { value: val },
    {
      where: {
        ageRange: age,
        sex: s,
      },
    },
  ).catch((err) => {
    throw err;
  });
};

const updateExtraData = async (identifier: string, val: number): Promise<void> => {
  await DefaultExtraData.update(
    { value: val },
    {
      where: {
        id: identifier,
      },
    },
  ).catch((err) => {
    throw err;
  });
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

// const getEquationValues = (ageBracket: AgeBracket, sex: Sex): number[] => {
//   let res: number[] = [];
//   switch (ageBracket) {
//     case (AgeBracket.m0): {
//       if (sex === Sex.Male) {
//         // -152 + (92.8*MP) + 211
//         res = [-152, 92.8, 211];
//       } else if (sex === Sex.Female) {
//         // -152 + (92.8*MP) + 178
//         res = [-152, 92.8, 178];
//       }
//       break;
//     }
//     case (AgeBracket.m1): {
//       if (sex === Sex.Male) {
//         // -152 + (92.8*MP) + 183
//         res = [-152, 92.8, 183];
//       } else if (sex === Sex.Female) {
//         // -152 + (92.8*MP) + 161
//         res = [-152, 92.8, 161];
//       }
//       break;
//     }
//     case (AgeBracket.m2): {
//       if (sex === Sex.Male) {
//         // -152 + (92.8*MP) + 139
//         res = [-152, 92.8, 139];
//       } else if (sex === Sex.Female) {
//         // -152 + (92.8*MP) + 134
//         res = [-152, 92.8, 134];
//       }
//       break;
//     }
//     case (AgeBracket.m3): {
//       if (sex === Sex.Male) {
//         // -152 + (92.8*MP) + 53
//         res = [-152, 92.8, 53];
//       } else if (sex === Sex.Female) {
//         // -152 + (92.8*MP) + 68
//         res = [-152, 92.8, 68];
//       }
//       break;
//     }
//     case (AgeBracket.m4): {
//       if (sex === Sex.Male) {
//         // -152 + (92.8*MP) + 46
//         res = [-152, 92.8, 46];
//       } else if (sex === Sex.Female) {
//         // -152 + (92.8*MP) + 57
//         res = [-152, 92.8, 57];
//       }
//       break;
//     }
//     case (AgeBracket.m5): {
//       if (sex === Sex.Male) {
//         // -152 + (92.8*MP) + 36
//         res = [-152, 92.8, 36];
//       } else if (sex === Sex.Female) {
//         // -152 + (92.8*MP) + 47
//         res = [-152, 92.8, 47];
//       }
//       break;
//     }
//     case (AgeBracket.m6): {
//       if (sex === Sex.Male) {
//         // -99.4 + (88.6*MP) + 17
//         res = [-99.4, 88.6, 17];
//       } else if (sex === Sex.Female) {
//         // -99.4 + (88.6*MP) + 20
//         res = [-99.4, 88.6, 20];
//       }
//       break;
//     }
//     case (AgeBracket.m7): {
//       if (sex === Sex.Male) {
//         // -99.4 + (88.6*MP) + 16
//         res = [-99.4, 88.6, 16];
//       } else if (sex === Sex.Female) {
//         // -99.4 + (88.6*MP) + 17
//         res = [-99.4, 88.6, 17];
//       }
//       break;
//     }
//     case (AgeBracket.m8): {
//       if (sex === Sex.Male) {
//         // -99.4 + (88.6*MP) + 14
//         res = [-99.4, 88.6, 14];
//       } else if (sex === Sex.Female) {
//         // -99.4 + (88.6*MP) + 15
//         res = [-99.4, 88.6, 15];
//       }
//       break;
//     }
//     case (AgeBracket.m9): {
//       if (sex === Sex.Male) {
//         // -99.4 + (88.6*MP) + 21
//         res = [-99.4, 88.6, 21];
//       } else if (sex === Sex.Female) {
//         // -99.4 + (88.6*MP) + 18
//         res = [-99.4, 88.6, 18];
//       }
//       break;
//     }
//     case (AgeBracket.m10): {
//       if (sex === Sex.Male) {
//         // -99.4 + (88.6*MP) + 21
//         res = [-99.4, 88.6, 21];
//       } else if (sex === Sex.Female) {
//         // -99.4 + (88.6*MP) + 15
//         res = [-99.4, 88.6, 15];
//       }
//       break;
//     }
//     case (AgeBracket.m11): {
//       if (sex === Sex.Male) {
//         // -99.4 + (88.6*MP) + 22
//         res = [-99.4, 88.6, 22];
//       } else if (sex === Sex.Female) {
//         // -99.4 + (88.6*MP) + 14
//         res = [-99.4, 88.6, 14];
//       }
//       break;
//     }
//     case (AgeBracket.a1): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 13
//         res = [310.2, 63.3, -0.263, 13];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 13
//         res = [263.4, 65.3, -0.454, 13];
//       }
//       break;
//     }
//     case (AgeBracket.a2): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 12
//         res = [310.2, 63.3, -0.263, 12];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 13
//         res = [263.4, 65.3, -0.454, 13];
//       }
//       break;
//     }
//     case (AgeBracket.a3): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 12
//         res = [310.2, 63.3, -0.263, 12];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 11
//         res = [263.4, 65.3, -0.454, 11];
//       }
//       break;
//     }
//     case (AgeBracket.a4): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 11
//         res = [310.2, 63.3, -0.263, 11];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 10
//         res = [263.4, 65.3, -0.454, 10];
//       }
//       break;
//     }
//     case (AgeBracket.a5): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 11
//         res = [310.2, 63.3, -0.263, 11];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 10
//         res = [263.4, 65.3, -0.454, 10];
//       }
//       break;
//     }
//     case (AgeBracket.a6): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 11, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 12, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 10, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 13, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a7): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 14, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 14, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 17, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 17, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a8): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 16, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 16, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 20, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 20, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a9): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 19, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 19, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 23, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 23, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a10): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 22, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 22, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 25, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 25, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a11): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 25, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 25, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 25, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 25, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a12): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 29, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 29, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 26, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 26, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a13): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 33, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 33, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 24, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 24, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a14): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 33, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 33, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 19, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 19, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a15): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 31, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 31, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 13, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 13, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a16): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 24, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 24, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 5, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 5, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a17): {
//       if (sex === Sex.Male) {
//         // 310.2 + (63.3*MP) - 0.263*MP^2 + 14, -15%/+15% for light/intense TEE
//         res = [310.2, 63.3, -0.263, 14, 15, 15];
//       } else if (sex === Sex.Female) {
//         // 263.4 + (65.3*MP) - 0.454*MP^2 + 0, -15%/+15% for light/intense TEE
//         res = [263.4, 65.3, -0.454, 0, 15, 15];
//       }
//       break;
//     }
//     case (AgeBracket.a18_29): {
//       if (sex === Sex.Male) {
//         // (15.057*MP + 692.2) * PAL
//         res = [15.057, 692.2, 1.95, 1.65, 1.85, 1.55];
//       } else if (sex === Sex.Female) {
//         // (14.818*MP + 486.6) * PAL, 208 and 251 extra energy for pregnant and lactating women
//         res = [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251];
//       }
//       break;
//     }
//     case (AgeBracket.a30_59): {
//       if (sex === Sex.Male) {
//         // (11.472*MP + 873.1) * PAL
//         res = [11.472, 873.1, 1.95, 1.65, 1.85, 1.55];
//       } else if (sex === Sex.Female) {
//         // (8.126*MP + 845.6) * PAL, 208 and 251 extra energy for pregnant and lactating women
//         res = [8.126, 845.6, 1.95, 1.65, 1.85, 1.55, 208, 251];
//       }
//       break;
//     }
//     case (AgeBracket.a60): {
//       if (sex === Sex.Male) {
//         // (11.711*MP + 587.7) * PAL
//         res = [11.711, 587.7, 1.95, 1.65, 1.85, 1.55];
//       } else if (sex === Sex.Female) {
//         // (9.082*MP + 658.5) * PAL
//         res = [9.082, 658.5, 1.95, 1.65, 1.85, 1.55];
//       }
//       break;
//     }

//     default: {
//       throw new Error('Parsing error, attribute edad does not respect format');
//     }
//   }
//   return res;
// };
