import age from '../src/Enum/AgeBracket';
import sex from '../src/Enum/Sex';
import '@testing-library/jest-dom/extend-expect';
import CalculatorService from '../src/Services/CalculatorService';
import ParameterDataBaseLoader from '../src/Loaders/ParameterDataBaseLoader';

describe('Verificar si funciona calculo del RE para menores de 1 año', () => {
  it('init database', async () => {
    await ParameterDataBaseLoader.initParameterDataBase();
    setTimeout(() => {}, 50);
  });
  it('Mujeres', async () => {
    setTimeout(async () => {
      expect(await CalculatorService.calculateEnergeticRequirement([{
        age: age.m3,
        sex: sex.Female,
        medianWeight: 6,
        population: 9,
      }],
      {
        minorPAL: {
          lowPALPrevalence: 0,
          moderatePALPrevalence: 100,
          intensePALPrevalence: 0,
        },
        adultPAL: {
          urbanPercentage: 94.7,
          activeUrbanPAL: 10,
          lowUrbanPAL: 90,
          ruralPercentage: 5.3,
          activeRuralPAL: 50,
          lowRuralPAL: 50,
        },
        maternity18To29: {
          countryBirthRate: 14,
          countryWomenInAgeGroup: 315790,
          countryPopulation: 3453691,
        },
        maternity30To59: undefined,
      })).toStrictEqual({
        groupsRequirements: [{
          group: {
            age: age.m3 as string,
            sex: sex.Female as string,
            medianWeight: 6,
            population: 9,
          },
          perCapita: 473,
          total: 4255,
        }],
        totalRequirement: {
          perCapita: 473,
          total: 4255,
          totalPopulation: 9,
        },
      });
    }, 100);
  });
  it('Varones', async () => {
    setTimeout(async () => {
      expect(await CalculatorService.calculateEnergeticRequirement([{
        age: age.m11,
        sex: sex.Male,
        medianWeight: 12,
        population: 7,
      }],
      {
        minorPAL: {
          lowPALPrevalence: 0,
          moderatePALPrevalence: 100,
          intensePALPrevalence: 0,
        },
        adultPAL: {
          urbanPercentage: 94.7,
          activeUrbanPAL: 10,
          lowUrbanPAL: 90,
          ruralPercentage: 5.3,
          activeRuralPAL: 50,
          lowRuralPAL: 50,
        },
        maternity18To29: {
          countryBirthRate: 14,
          countryWomenInAgeGroup: 315790,
          countryPopulation: 3453691,
        },
        maternity30To59: undefined,
      })).toStrictEqual({
        groupsRequirements: [{
          group: {
            age: age.m11 as string,
            sex: sex.Male as string,
            medianWeight: 12,
            population: 7,
          },
          perCapita: 986,
          total: 6901,
        }],
        totalRequirement: {
          perCapita: 986,
          total: 6901,
          totalPopulation: 7,
        },
      });
    });
  }, 100);
});

describe('Verificar si funciona calculo del RE para personas de 1 a 5 años', () => {
  it('Mujeres', async () => {
    expect(await CalculatorService.calculateEnergeticRequirement([{
      age: age.a5,
      sex: sex.Female,
      medianWeight: 23,
      population: 6,
    }],
    {
      minorPAL: {
        lowPALPrevalence: 0,
        moderatePALPrevalence: 100,
        intensePALPrevalence: 0,
      },
      adultPAL: {
        urbanPercentage: 94.7,
        activeUrbanPAL: 10,
        lowUrbanPAL: 90,
        ruralPercentage: 5.3,
        activeRuralPAL: 50,
        lowRuralPAL: 50,
      },
      maternity18To29: {
        countryBirthRate: 14,
        countryWomenInAgeGroup: 315790,
        countryPopulation: 3453691,
      },
      maternity30To59: undefined,
    })).toStrictEqual({
      groupsRequirements: [{
        group: {
          age: age.a5 as string,
          sex: sex.Female as string,
          medianWeight: 23,
          population: 6,
        },
        perCapita: 1535,
        total: 9211,
      }],
      totalRequirement: {
        perCapita: 1535,
        total: 9211,
        totalPopulation: 6,
      },
    });
  });
  it('Varones', async () => {
    expect(await CalculatorService.calculateEnergeticRequirement([{
      age: age.a3,
      sex: sex.Male,
      medianWeight: 20,
      population: 9,
    }],
    {
      minorPAL: {
        lowPALPrevalence: 0,
        moderatePALPrevalence: 100,
        intensePALPrevalence: 0,
      },
      adultPAL: {
        urbanPercentage: 94.7,
        activeUrbanPAL: 10,
        lowUrbanPAL: 90,
        ruralPercentage: 5.3,
        activeRuralPAL: 50,
        lowRuralPAL: 50,
      },
      maternity18To29: {
        countryBirthRate: 14,
        countryWomenInAgeGroup: 315790,
        countryPopulation: 3453691,
      },
      maternity30To59: undefined,
    })).toStrictEqual({
      groupsRequirements: [{
        group: {
          age: age.a3 as string,
          sex: sex.Male as string,
          medianWeight: 20,
          population: 9,
        },
        perCapita: 1483,
        total: 13347,
      }],
      totalRequirement: {
        perCapita: 1483,
        total: 13347,
        totalPopulation: 9,
      },
    });
  });
});

describe('Verificar si funciona calculo del RE para personas de 6 a 17 años', () => {
  it('Mujeres', async () => {
    expect(await CalculatorService.calculateEnergeticRequirement([{
      age: age.a6,
      sex: sex.Female,
      medianWeight: 23,
      population: 6,
    }],
    {
      minorPAL: {
        lowPALPrevalence: 0,
        moderatePALPrevalence: 100,
        intensePALPrevalence: 0,
      },
      adultPAL: undefined,
      maternity18To29: undefined,
      maternity30To59: undefined,
    })).toStrictEqual({
      groupsRequirements: [{
        group: {
          age: age.a6 as string,
          sex: sex.Female as string,
          medianWeight: 23,
          population: 6,
        },
        perCapita: 1538,
        total: 9229,
      }],
      totalRequirement: {
        perCapita: 1538,
        total: 9229,
        totalPopulation: 6,
      },
    });
  });
  it('Varones', async () => {
    expect(await CalculatorService.calculateEnergeticRequirement([{
      age: age.a6,
      sex: sex.Male,
      medianWeight: 23,
      population: 6,
    }],
    {
      minorPAL: {
        lowPALPrevalence: 0,
        moderatePALPrevalence: 100,
        intensePALPrevalence: 0,
      },
      adultPAL: undefined,
      maternity18To29: undefined,
      maternity30To59: undefined,
    })).toStrictEqual({
      groupsRequirements: [{
        group: {
          age: age.a6 as string,
          sex: sex.Male as string,
          medianWeight: 23,
          population: 6,
        },
        perCapita: 1639,
        total: 9834,
      }],
      totalRequirement: {
        perCapita: 1639,
        total: 9834,
        totalPopulation: 6,
      },
    });
  });
});

describe('Verificar si funciona calculo del RE para personas de 18 a 29 años', () => {
  it('Mujeres', async () => {
    expect(await CalculatorService.calculateEnergeticRequirement([{
      age: age.a18_29,
      sex: sex.Female,
      medianWeight: 70,
      population: 6,
    }],
    {
      minorPAL: {
        lowPALPrevalence: 0,
        moderatePALPrevalence: 100,
        intensePALPrevalence: 0,
      },
      adultPAL: {
        urbanPercentage: 94.7,
        activeUrbanPAL: 10,
        lowUrbanPAL: 90,
        ruralPercentage: 5.3,
        activeRuralPAL: 50,
        lowRuralPAL: 50,
      },
      maternity18To29: {
        countryBirthRate: 14,
        countryWomenInAgeGroup: 315790,
        countryPopulation: 3453691,
      },
      maternity30To59: undefined,
    })).toStrictEqual({
      groupsRequirements: [{
        group: {
          age: age.a18_29 as string,
          sex: sex.Female as string,
          medianWeight: 70,
          population: 6,
        },
        perCapita: 2469,
        total: 14811,
      }],
      totalRequirement: {
        perCapita: 2469,
        total: 14811,
        totalPopulation: 6,
      },
    });
  });
  it('Varones', async () => {
    expect(await CalculatorService.calculateEnergeticRequirement([{
      age: age.a18_29,
      sex: sex.Male,
      medianWeight: 70,
      population: 6,
    }],
    {
      minorPAL: {
        lowPALPrevalence: 0,
        moderatePALPrevalence: 100,
        intensePALPrevalence: 0,
      },
      adultPAL: {
        urbanPercentage: 94.7,
        activeUrbanPAL: 10,
        lowUrbanPAL: 90,
        ruralPercentage: 5.3,
        activeRuralPAL: 50,
        lowRuralPAL: 50,
      },
      maternity18To29: {
        countryBirthRate: 14,
        countryWomenInAgeGroup: 315790,
        countryPopulation: 3453691,
      },
      maternity30To59: undefined,
    })).toStrictEqual({
      groupsRequirements: [{
        group: {
          age: age.a18_29 as string,
          sex: sex.Male as string,
          medianWeight: 70,
          population: 6,
        },
        perCapita: 2779,
        total: 16676,
      }],
      totalRequirement: {
        perCapita: 2779,
        total: 16676,
        totalPopulation: 6,
      },
    });
  });
});

describe('Verificar si funciona calculo del RE para personas de 30 a 59 años', () => {
  it('Mujeres', async () => {
    expect(await CalculatorService.calculateEnergeticRequirement([{
      age: age.a30_59,
      sex: sex.Female,
      medianWeight: 70,
      population: 6,
    }],
    {
      minorPAL: {
        lowPALPrevalence: 0,
        moderatePALPrevalence: 100,
        intensePALPrevalence: 0,
      },
      adultPAL: {
        urbanPercentage: 94.7,
        activeUrbanPAL: 10,
        lowUrbanPAL: 90,
        ruralPercentage: 5.3,
        activeRuralPAL: 50,
        lowRuralPAL: 50,
      },
      maternity18To29: {
        countryBirthRate: 14,
        countryWomenInAgeGroup: 315790,
        countryPopulation: 3453691,
      },
      maternity30To59: undefined,
    })).toStrictEqual({
      groupsRequirements: [{
        group: {
          age: age.a30_59 as string,
          sex: sex.Female as string,
          medianWeight: 70,
          population: 6,
        },
        perCapita: 2251,
        total: 13508,
      }],
      totalRequirement: {
        perCapita: 2251,
        total: 13508,
        totalPopulation: 6,
      },
    });
  });
  it('Varones', async () => {
    expect(await CalculatorService.calculateEnergeticRequirement([{
      age: age.a30_59,
      sex: sex.Male,
      medianWeight: 70,
      population: 6,
    }],
    {
      minorPAL: {
        lowPALPrevalence: 0,
        moderatePALPrevalence: 100,
        intensePALPrevalence: 0,
      },
      adultPAL: {
        urbanPercentage: 94.7,
        activeUrbanPAL: 10,
        lowUrbanPAL: 90,
        ruralPercentage: 5.3,
        activeRuralPAL: 50,
        lowRuralPAL: 50,
      },
      maternity18To29: {
        countryBirthRate: 14,
        countryWomenInAgeGroup: 315790,
        countryPopulation: 3453691,
      },
      maternity30To59: undefined,
    })).toStrictEqual({
      groupsRequirements: [{
        group: {
          age: age.a30_59 as string,
          sex: sex.Male as string,
          medianWeight: 70,
          population: 6,
        },
        perCapita: 2668,
        total: 16007,
      }],
      totalRequirement: {
        perCapita: 2668,
        total: 16007,
        totalPopulation: 6,
      },
    });
  });
});

describe('Verificar si funciona calculo del RE para personas de 60 años o mas', () => {
  it('Mujeres', async () => {
    expect(await CalculatorService.calculateEnergeticRequirement([{
      age: age.a60,
      sex: sex.Female,
      medianWeight: 70,
      population: 6,
    }],
    {
      minorPAL: {
        lowPALPrevalence: 0,
        moderatePALPrevalence: 100,
        intensePALPrevalence: 0,
      },
      adultPAL: {
        urbanPercentage: 94.7,
        activeUrbanPAL: 10,
        lowUrbanPAL: 90,
        ruralPercentage: 5.3,
        activeRuralPAL: 50,
        lowRuralPAL: 50,
      },
      maternity18To29: {
        countryBirthRate: 14,
        countryWomenInAgeGroup: 315790,
        countryPopulation: 3453691,
      },
      maternity30To59: undefined,
    })).toStrictEqual({
      groupsRequirements: [{
        group: {
          age: age.a60 as string,
          sex: sex.Female as string,
          medianWeight: 70,
          population: 6,
        },
        perCapita: 2060,
        total: 12360,
      }],
      totalRequirement: {
        perCapita: 2060,
        total: 12360,
        totalPopulation: 6,
      },
    });
  });
  it('Varones', async () => {
    expect(await CalculatorService.calculateEnergeticRequirement([{
      age: age.a60,
      sex: sex.Male,
      medianWeight: 70,
      population: 6,
    }],
    {
      minorPAL: {
        lowPALPrevalence: 0,
        moderatePALPrevalence: 100,
        intensePALPrevalence: 0,
      },
      adultPAL: {
        urbanPercentage: 94.7,
        activeUrbanPAL: 10,
        lowUrbanPAL: 90,
        ruralPercentage: 5.3,
        activeRuralPAL: 50,
        lowRuralPAL: 50,
      },
      maternity18To29: {
        countryBirthRate: 14,
        countryWomenInAgeGroup: 315790,
        countryPopulation: 3453691,
      },
      maternity30To59: undefined,
    })).toStrictEqual({
      groupsRequirements: [{
        group: {
          age: age.a60 as string,
          sex: sex.Male as string,
          medianWeight: 70,
          population: 6,
        },
        perCapita: 2240,
        total: 13441,
      }],
      totalRequirement: {
        perCapita: 2240,
        total: 13441,
        totalPopulation: 6,
      },
    });
  });
});
