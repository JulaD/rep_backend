import '@testing-library/jest-dom/extend-expect';
import AgeBracket from '../src/Enum/AgeBracket';
import ParameterType from '../src/Enum/ParameterType';
import Sex from '../src/Enum/Sex';
import DefaultWeight from '../src/Models/DefaultWeight';
import ParameterService from '../src/Services/ParameterService';
import ParameterDataBaseLoader from '../src/Loaders/ParameterDataBaseLoader';
import DefaultExtraData from '../src/Models/DefaultExtraData';
import EquationConstant from '../src/Models/EquationConstant';

describe('Verificar si devuelve los parametros correctamente', () => {
  it('init database', async () => {
    await ParameterDataBaseLoader.initParameterDataBase();
  });
  it('Pesos por defecto', async () => {
    expect((await ParameterService.getDefaultWeights()).length).toBe(64);
  });
  it('Datos Extra', async () => {
    expect((await ParameterService.getDefaultExtraData()).length).toBe(12);
  });
  it('Constantes de ecuacion varones de 1 año', async () => {
    expect(new Set(await ParameterService.getEquationValues(AgeBracket.a1, Sex.Male)))
      .toEqual(new Set([310.2, 63.3, -0.263, 13]));
  });
  it('Constantes de ecuacion mujeres de 10 años', async () => {
    expect(new Set(await ParameterService.getEquationValues(AgeBracket.a10, Sex.Female)))
      .toEqual(new Set([263.4, 65.3, -0.454, 25, -15, 15]));
  });
  it('Constantes de ecuacion mujeres de 2 años', async () => {
    expect(new Set(await ParameterService.getEquationValues(AgeBracket.a2, Sex.Female)))
      .toEqual(new Set([263.4, 65.3, -0.454, 13]));
  });
  it('Constantes de ecuacion mujeres de 5 meses', async () => {
    expect(new Set(await ParameterService.getEquationValues(AgeBracket.m5, Sex.Female)))
      .toEqual(new Set([-152, 92.8, 47]));
  });
  it('Constantes de ecuacion hombres de 7 meses', async () => {
    expect(new Set(await ParameterService.getEquationValues(AgeBracket.m7, Sex.Male)))
      .toEqual(new Set([-99.4, 88.6, 16]));
  });
});

describe('Verificar si actualiza los pesos correctamente', () => {
  it('init database', async () => {
    await ParameterDataBaseLoader.initParameterDataBase();
  });
  it('Actualizacion de peso mujeres 11 años', async () => {
    await ParameterService.updateDefaultWeight({
      ageRange: AgeBracket.a11,
      sex: Sex.Female,
      parameterType: ParameterType.DefaultWeight,
      value: 80,
    });
    expect((await DefaultWeight.findOne({
      where: {
        ageRange: AgeBracket.a11 as string,
        sex: Sex.Female as string,
      },
    }))?.getDataValue('value')).toEqual(80);
  });
  it('Actualizacion de peso varones 18 a 29 años', async () => {
    await ParameterService.updateDefaultWeight({
      ageRange: AgeBracket.a18_29,
      sex: Sex.Male,
      parameterType: ParameterType.DefaultWeight,
      value: 200,
    });
    expect((await DefaultWeight.findOne({
      where: {
        ageRange: AgeBracket.a18_29 as string,
        sex: Sex.Male as string,
      },
    }))?.getDataValue('value')).toEqual(200);
  });
  it('Actualizacion de peso mujeres 60+ años', async () => {
    await ParameterService.updateDefaultWeight({
      ageRange: AgeBracket.a60,
      sex: Sex.Female,
      parameterType: ParameterType.DefaultWeight,
      value: 20,
    });
    expect((await DefaultWeight.findOne({
      where: {
        ageRange: AgeBracket.a60 as string,
        sex: Sex.Female as string,
      },
    }))?.getDataValue('value')).toEqual(20);
  });
});

describe('Verificar si actualiza los datos extra correctamente', () => {
  it('Actualizacion poblacion del pais por defecto', async () => {
    await ParameterService.updateExtraData([{
      id: 'countryPopulation',
      parameterType: ParameterType.Maternity,
      value: 5000000,
      description: 'epa',
      order: 0,
    }]);
    expect((await DefaultExtraData.findOne({
      where: {
        id: 'countryPopulation',
      },
    }))?.getDataValue('value')).toEqual(5000000);
  });
  it('Actualizacion prevalencia de NAF de menores', async () => {
    await ParameterService.updateExtraData([{
      id: 'minorLowPrevalence',
      parameterType: ParameterType.MinorPAL,
      value: 20,
      description: 'epa',
      order: 0,
    },
    {
      id: 'minorModeratePrevalence',
      parameterType: ParameterType.MinorPAL,
      value: 35,
      description: 'epa',
      order: 0,
    },
    {
      id: 'minorIntensePrevalence',
      parameterType: ParameterType.MinorPAL,
      value: 45,
      description: 'epa',
      order: 0,
    }]);
    expect((await DefaultExtraData.findOne({
      where: {
        id: 'minorLowPrevalence',
      },
    }))?.getDataValue('value')).toEqual(20);
    expect((await DefaultExtraData.findOne({
      where: {
        id: 'minorModeratePrevalence',
      },
    }))?.getDataValue('value')).toEqual(35);
    expect((await DefaultExtraData.findOne({
      where: {
        id: 'minorIntensePrevalence',
      },
    }))?.getDataValue('value')).toEqual(45);
  });
  it('Actualizacion porcentaje de poblacion rural y urbana', async () => {
    await ParameterService.updateExtraData([{
      id: 'ruralPopulation',
      parameterType: ParameterType.AdultPAL,
      value: 44,
      description: 'epa',
      order: 0,
    }]);
    expect((await DefaultExtraData.findOne({
      where: {
        id: 'ruralPopulation',
      },
    }))?.getDataValue('value')).toEqual(44);
    expect((await DefaultExtraData.findOne({
      where: {
        id: 'urbanPopulation',
      },
    }))?.getDataValue('value')).toEqual(56);
  });
});

describe('Verificar si actualiza las constantes de ecuaciones correctamente', () => {
  it('Actualizacion energia para el crecimiento mujeres 6 años', async () => {
    await ParameterService.updateGrowthEnergy({
      parameterType: ParameterType.GrowthEnergy,
      ageRange: AgeBracket.a6,
      sex: Sex.Female,
      value: 653,
      description: 'epa',
      order: 3,
    });
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.a6,
        sex: Sex.Female,
        order: 3,
        parameterType: ParameterType.GrowthEnergy,
      },
    }))?.getDataValue('value')).toEqual(653);
  });
  it('Actualizacion constantes ecuacion GET varones 15 años', async () => {
    await ParameterService.updateTEE([{
      parameterType: ParameterType.TEE,
      ageRange: AgeBracket.a15,
      sex: Sex.Male,
      value: 65.0,
      description: 'epa',
      order: 0,
    },
    {
      parameterType: ParameterType.TEE,
      ageRange: AgeBracket.a15,
      sex: Sex.Male,
      value: 87.95,
      description: 'epa',
      order: 1,
    },
    {
      parameterType: ParameterType.TEE,
      ageRange: AgeBracket.a15,
      sex: Sex.Male,
      value: 100.6,
      description: 'epa',
      order: 2,
    }]);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.a15,
        sex: Sex.Male,
        order: 0,
        parameterType: ParameterType.TEE,
      },
    }))?.getDataValue('value')).toEqual(65.0);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.a15,
        sex: Sex.Male,
        order: 1,
        parameterType: ParameterType.TEE,
      },
    }))?.getDataValue('value')).toEqual(87.95);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.a15,
        sex: Sex.Male,
        order: 2,
        parameterType: ParameterType.TEE,
      },
    }))?.getDataValue('value')).toEqual(100.6);
  });
  it('Actualizacion constantes ecuacion GET varones 10 meses', async () => {
    await ParameterService.updateTEE([{
      parameterType: ParameterType.TEE,
      ageRange: AgeBracket.m10,
      sex: Sex.Male,
      value: 65.0,
      description: 'epa',
      order: 0,
    },
    {
      parameterType: ParameterType.TEE,
      ageRange: AgeBracket.m10,
      sex: Sex.Male,
      value: 87.95,
      description: 'epa',
      order: 1,
    }]);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.m10,
        sex: Sex.Male,
        order: 0,
        parameterType: ParameterType.TEE,
      },
    }))?.getDataValue('value')).toEqual(65.0);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.m10,
        sex: Sex.Male,
        order: 1,
        parameterType: ParameterType.TEE,
      },
    }))?.getDataValue('value')).toEqual(87.95);
  });
  it('Actualizacion constantes ecuacion GET mujeres 2 meses', async () => {
    await ParameterService.updateTEE([{
      parameterType: ParameterType.TEE,
      ageRange: AgeBracket.m2,
      sex: Sex.Female,
      value: 65.0,
      description: 'epa',
      order: 0,
    },
    {
      parameterType: ParameterType.TEE,
      ageRange: AgeBracket.m2,
      sex: Sex.Female,
      value: 87.95,
      description: 'epa',
      order: 1,
    }]);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.m2,
        sex: Sex.Female,
        order: 0,
        parameterType: ParameterType.TEE,
      },
    }))?.getDataValue('value')).toEqual(65.0);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.m2,
        sex: Sex.Female,
        order: 1,
        parameterType: ParameterType.TEE,
      },
    }))?.getDataValue('value')).toEqual(87.95);
  });
  it('Actualizacion constantes ecuacion TMB varones 30 a 59 años', async () => {
    await ParameterService.updateBMR([{
      parameterType: ParameterType.BMR,
      ageRange: AgeBracket.a30_59,
      sex: Sex.Male,
      value: 90.1,
      description: 'epa',
      order: 0,
    },
    {
      parameterType: ParameterType.BMR,
      ageRange: AgeBracket.a30_59,
      sex: Sex.Male,
      value: 100.75,
      description: 'epa',
      order: 1,
    }]);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.a30_59,
        sex: Sex.Male,
        order: 0,
        parameterType: ParameterType.BMR,
      },
    }))?.getDataValue('value')).toEqual(90.1);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.a30_59,
        sex: Sex.Male,
        order: 1,
        parameterType: ParameterType.BMR,
      },
    }))?.getDataValue('value')).toEqual(100.75);
  });
  it('Actualizacion constantes ecuacion TMB varones 18 a 29 años', async () => {
    await ParameterService.updateBMR([{
      parameterType: ParameterType.BMR,
      ageRange: AgeBracket.a18_29,
      sex: Sex.Male,
      value: 90.1,
      description: 'epa',
      order: 0,
    },
    {
      parameterType: ParameterType.BMR,
      ageRange: AgeBracket.a18_29,
      sex: Sex.Male,
      value: 100.75,
      description: 'epa',
      order: 1,
    }]);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.a18_29,
        sex: Sex.Male,
        order: 0,
        parameterType: ParameterType.BMR,
      },
    }))?.getDataValue('value')).toEqual(90.1);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.a18_29,
        sex: Sex.Male,
        order: 1,
        parameterType: ParameterType.BMR,
      },
    }))?.getDataValue('value')).toEqual(100.75);
  });
  it('Actualizacion constantes ecuacion TMB mujeres mayores de 60 años', async () => {
    await ParameterService.updateBMR([{
      parameterType: ParameterType.BMR,
      ageRange: AgeBracket.a60,
      sex: Sex.Female,
      value: 90.1,
      description: 'epa',
      order: 0,
    },
    {
      parameterType: ParameterType.BMR,
      ageRange: AgeBracket.a60,
      sex: Sex.Female,
      value: 100.75,
      description: 'epa',
      order: 1,
    }]);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.a60,
        sex: Sex.Female,
        order: 0,
        parameterType: ParameterType.BMR,
      },
    }))?.getDataValue('value')).toEqual(90.1);
    expect((await EquationConstant.findOne({
      where: {
        ageRange: AgeBracket.a60,
        sex: Sex.Female,
        order: 1,
        parameterType: ParameterType.BMR,
      },
    }))?.getDataValue('value')).toEqual(100.75);
  });
});
