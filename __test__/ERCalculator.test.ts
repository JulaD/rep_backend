import age from '../src/Enum/AgeBracket';
import sex from '../src/Enum/Sex';
import ERCalculator from '../src/Services/ERCalculator';
import '@testing-library/jest-dom/extend-expect';

expect.extend({
  toBeWithinRange(received, result, margin) {
    const pass = received >= result - margin && received <= result + margin;
    if (pass) {
      return {
        message: (): string => `expected ${received} not to be within range ${result} +- ${margin}`,
        pass: true,
      };
    }
    return {
      message: (): string => `expected ${received} to be within range ${result} +- ${margin}`,
      pass: false,
    };
  },
});

describe('Check', () => {
  it("Probar si se devuelve 'true' cuando el tipo es IndividualMaternity", () => { expect(ERCalculator.isIndividualMaternity({ pregnantWomen: 5, lactatingWomen: 2 })).toBe(true); });
  it("Probar si se devuelve 'false' cuando el tipo NO es IndividualMaternity", () => { expect(ERCalculator.isIndividualMaternity({ countryBirthRate: 3, countryWomenInAgeGroup: 2, countryPopulation: 1239 })).toBe(false); });
});

describe('Verificar si funciona el cálculo del GET (entre 6 y 17 años)', () => {
  it('Varones de 15 años', () => {
    expect(Math.round(ERCalculator.calculateTEE({
      age: age.a15, sex: sex.Male, medianWeight: 55, population: 5,
    }, [310.2, 63.3, -0.263, 31, -15, 15],
    { lowPALPrevalence: 20, moderatePALPrevalence: 80, intensePALPrevalence: 0 }))).toBe(2906);
  });
  it('Mujeres de 8 años', () => {
    expect(Math.round(ERCalculator.calculateTEE({
      age: age.a8, sex: sex.Female, medianWeight: 26.7, population: 9,
    }, [263.4, 65.3, -0.454, 20, -15, 15],
    { lowPALPrevalence: 11, moderatePALPrevalence: 89, intensePALPrevalence: 0 }))).toBe(1655);
  });
  it('Varones de 17 años', () => {
    expect(Math.round(ERCalculator.calculateTEE({
      age: age.a17, sex: sex.Male, medianWeight: 66.1, population: 18,
    }, [310.2, 63.3, -0.263, 14, -15, 15],
    { lowPALPrevalence: 25, moderatePALPrevalence: 25, intensePALPrevalence: 50 }))).toBe(3471);
  });
});

describe('Verificar si funciona el cálculo del TMB (mayores a 18 años)', () => {
  it('Varones de 18-29 años', () => {
    expect(Math.round(ERCalculator.calculateBMR({
      age: age.a18_29, sex: sex.Male, medianWeight: 73.1, population: 13,
    }, [15.057, 692.2, 1.95, 1.65, 1.85, 1.55]))).toBe(1793);
  });
  it('Mujeres de 30-59 años', () => {
    expect(Math.round(ERCalculator.calculateBMR({
      age: age.a30_59, sex: sex.Female, medianWeight: 63.8, population: 21,
    }, [8.126, 845.6, 1.95, 1.65, 1.85, 1.55, 208, 251]))).toBe(1364);
  });
  it('Varones de 60+ años', () => {
    expect(Math.round(ERCalculator.calculateBMR({
      age: age.a60, sex: sex.Male, medianWeight: 66.1, population: 11,
    }, [11.711, 587.7, 1.95, 1.65, 1.85, 1.55]))).toBe(1362);
  });
});

describe('Verificar si funciona el cálculo del NAF (mayores a 18 años)', () => {
  it('Mezclado urbano/rural', () => {
    expect(ERCalculator.calculatePAL([15.057, 692.2, 1.95, 1.65, 1.85, 1.55],
      {
        urbanPercentage: 60,
        activeUrbanPAL: 30,
        lowUrbanPAL: 70,
        ruralPercentage: 40,
        activeRuralPAL: 80,
        lowRuralPAL: 20,
      })).toBeCloseTo(1.74);
  });
  it('Solo urbano', () => {
    expect(ERCalculator.calculatePAL([15.057, 692.2, 1.95, 1.65, 1.85, 1.55],
      {
        urbanPercentage: 100,
        activeUrbanPAL: 36,
        lowUrbanPAL: 64,
        ruralPercentage: 0,
        activeRuralPAL: 80,
        lowRuralPAL: 20,
      })).toBeCloseTo(1.66);
  });
  it('Solo rural', () => {
    expect(ERCalculator.calculatePAL([15.057, 692.2, 1.95, 1.65, 1.85, 1.55],
      {
        urbanPercentage: 0,
        activeUrbanPAL: 36,
        lowUrbanPAL: 64,
        ruralPercentage: 100,
        activeRuralPAL: 74,
        lowRuralPAL: 26,
      })).toBeCloseTo(1.87);
  });
});

describe('Verificar si funciona la ponderacion del RE para mujeres pasando IndividualMaternity', () => {
  it('Mezclado con mujeres embarazadas y lactando', () => {
    expect(Math.round(ERCalculator.calculateERWomenIndividual({
      age: age.a18_29,
      sex: sex.Female,
      medianWeight: 73.1,
      population: 48,
    },
    [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
    {
      pregnantWomen: 15,
      lactatingWomen: 4,
    },
    2499))).toBeWithinRange(2584, 1);
  });
  it('Solo con mujeres embarazadas', () => {
    expect(Math.round(ERCalculator.calculateERWomenIndividual({
      age: age.a18_29,
      sex: sex.Female,
      medianWeight: 73.1,
      population: 48,
    },
    [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
    {
      pregnantWomen: 15,
      lactatingWomen: 0,
    },
    2499))).toBeWithinRange(2564, 1);
  });
  it('Solo con mujeres lactando', () => {
    expect(Math.round(ERCalculator.calculateERWomenIndividual({
      age: age.a18_29,
      sex: sex.Female,
      medianWeight: 73.1,
      population: 48,
    },
    [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
    {
      pregnantWomen: 0,
      lactatingWomen: 10,
    },
    2499))).toBeWithinRange(2551, 1);
  });
  it('Sin mujeres embarazadas/lactando', () => {
    expect(Math.round(ERCalculator.calculateERWomenIndividual({
      age: age.a18_29,
      sex: sex.Female,
      medianWeight: 73.1,
      population: 48,
    },
    [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
    {
      pregnantWomen: 0,
      lactatingWomen: 0,
    },
    2499))).toBeWithinRange(2499, 1);
  });
});

describe('Verificar si funciona la ponderacion del RE para mujeres pasando PopulationMaternity', () => {
  it('Mezclado con mujeres embarazadas y lactando', () => {
    expect(Math.round(ERCalculator.calculateERWomenPopulation(
      [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
      {
        countryBirthRate: 14,
        countryWomenInAgeGroup: 315790,
        countryPopulation: 3453691,
      },
      2499,
    ))).toBeWithinRange(2542, 1);
  });
  it('Sin mujeres embarazadas/lactando', () => {
    expect(Math.round(ERCalculator.calculateERWomenPopulation(
      [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
      {
        countryBirthRate: 0,
        countryWomenInAgeGroup: 315790,
        countryPopulation: 3453691,
      },
      2499,
    ))).toBeWithinRange(2499, 1);
  });
});

describe('Verificar si funciona calculo del RE para menores de 1 año', () => {
  it('Mujeres', () => {
    expect(ERCalculator.calculateLessThanAYear({
      age: age.m3,
      sex: sex.Female,
      medianWeight: 6,
      population: 9,
    },
    [-152, 92.8, 68])).toStrictEqual({
      group: {
        age: age.m3,
        sex: sex.Female,
        medianWeight: 6,
        population: 9,
      },
      perCapita: 473,
      total: 4255,
    });
  });
  it('Varones', () => {
    expect(ERCalculator.calculateLessThanAYear({
      age: age.m11,
      sex: sex.Male,
      medianWeight: 12,
      population: 7,
    },
    [-99.4, 88.6, 22])).toStrictEqual({
      group: {
        age: age.m11,
        sex: sex.Male,
        medianWeight: 12,
        population: 7,
      },
      perCapita: 986,
      total: 6901,
    });
  });
});

describe('Verificar si funciona calculo del RE para personas de 1 a 5 años', () => {
  it('Mujeres', () => {
    expect(ERCalculator.calculate1To5Years({
      age: age.a5,
      sex: sex.Female,
      medianWeight: 23,
      population: 6,
    },
    [263.4, 65.3, -0.454, 10])).toStrictEqual({
      group: {
        age: age.a5,
        sex: sex.Female,
        medianWeight: 23,
        population: 6,
      },
      perCapita: 1535,
      total: 9211,
    });
  });
  it('Varones', () => {
    expect(ERCalculator.calculate1To5Years({
      age: age.a3,
      sex: sex.Male,
      medianWeight: 20,
      population: 9,
    },
    [310.2, 63.3, -0.263, 12])).toStrictEqual({
      group: {
        age: age.a3,
        sex: sex.Male,
        medianWeight: 20,
        population: 9,
      },
      perCapita: 1483,
      total: 13347,
    });
  });
});

describe('Verificar si funciona calculo del RE para personas de 6 a 17 años', () => {
  it('Mujeres', () => {
    expect(ERCalculator.calculate6To17Years({
      age: age.a16,
      sex: sex.Female,
      medianWeight: 53,
      population: 6,
    },
    [263.4, 65.3, -0.454, 5, -15, 15],
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
      group: {
        age: age.a16,
        sex: sex.Female,
        medianWeight: 53,
        population: 6,
      },
      perCapita: 2454,
      total: 14724,
    });
  });
  it('Varones', () => {
    expect(ERCalculator.calculate6To17Years({
      age: age.a13,
      sex: sex.Male,
      medianWeight: 37,
      population: 6,
    },
    [310.2, 63.3, -0.263, 33, -15, 15],
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
      group: {
        age: age.a13,
        sex: sex.Male,
        medianWeight: 37,
        population: 6,
      },
      perCapita: 2325,
      total: 13952,
    });
  });
  it('Varones sin pasar data de actividad fisica', () => {
    expect(() => {
      ERCalculator.calculate6To17Years({
        age: age.a13,
        sex: sex.Male,
        medianWeight: 37,
        population: 6,
      },
      [310.2, 63.3, -0.263, 33, -15, 15],
      {
        minorPAL: undefined,
        adultPAL: undefined,
        maternity18To29: undefined,
        maternity30To59: undefined,
      });
    }).toThrow(Error('Missing minors\' physical activity prevalence data'));
  });
});

describe('Verificar si funciona calculo del RE para personas de 18 a 29 años', () => {
  it('Mujeres', () => {
    expect(ERCalculator.calculate18To29Years({
      age: age.a18_29,
      sex: sex.Female,
      medianWeight: 70,
      population: 10,
    },
    [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
    {
      minorPAL: undefined,
      adultPAL: {
        urbanPercentage: 70,
        activeUrbanPAL: 36,
        lowUrbanPAL: 64,
        ruralPercentage: 30,
        activeRuralPAL: 74,
        lowRuralPAL: 26,
      },
      maternity18To29: {
        pregnantWomen: 1,
        lactatingWomen: 2,
      },
      maternity30To59: undefined,
    })).toStrictEqual({
      group: {
        age: age.a18_29,
        sex: sex.Female,
        medianWeight: 70,
        population: 10,
      },
      perCapita: 2695,
      total: 26954,
    });
  });
  it('Varones', () => {
    expect(ERCalculator.calculate18To29Years({
      age: age.a18_29,
      sex: sex.Male,
      medianWeight: 83,
      population: 6,
    },
    [15.057, 692.2, 1.95, 1.65, 1.85, 1.55],
    {
      minorPAL: undefined,
      adultPAL: {
        urbanPercentage: 70,
        activeUrbanPAL: 36,
        lowUrbanPAL: 64,
        ruralPercentage: 30,
        activeRuralPAL: 74,
        lowRuralPAL: 26,
      },
      maternity18To29: undefined,
      maternity30To59: undefined,
    })).toStrictEqual({
      group: {
        age: age.a18_29,
        sex: sex.Male,
        medianWeight: 83,
        population: 6,
      },
      perCapita: 3344,
      total: 20066,
    });
  });
  it('Mujeres sin pasar data de maternidad', () => {
    expect(() => {
      ERCalculator.calculate18To29Years({
        age: age.a18_29,
        sex: sex.Female,
        medianWeight: 70,
        population: 10,
      },
      [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
      {
        minorPAL: undefined,
        adultPAL: {
          urbanPercentage: 70,
          activeUrbanPAL: 36,
          lowUrbanPAL: 64,
          ruralPercentage: 30,
          activeRuralPAL: 74,
          lowRuralPAL: 26,
        },
        maternity18To29: undefined,
        maternity30To59: undefined,
      });
    }).toThrow(Error('Missing maternity data for women aged 18 to 29'));
  });
  it('Hombres sin pasar data de NAF', () => {
    expect(() => {
      ERCalculator.calculate18To29Years({
        age: age.a18_29,
        sex: sex.Male,
        medianWeight: 70,
        population: 10,
      },
      [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
      {
        minorPAL: undefined,
        adultPAL: undefined,
        maternity18To29: undefined,
        maternity30To59: undefined,
      });
    }).toThrow(Error('Missing adults\' physical activity prevalence data'));
  });
});

describe('Verificar si funciona calculo del RE para personas de 30 a 59 años', () => {
  it('Mujeres', () => {
    expect(ERCalculator.calculate30To59Years({
      age: age.a30_59,
      sex: sex.Female,
      medianWeight: 76,
      population: 10,
    },
    [8.126, 845.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
    {
      minorPAL: undefined,
      adultPAL: {
        urbanPercentage: 70,
        activeUrbanPAL: 36,
        lowUrbanPAL: 64,
        ruralPercentage: 30,
        activeRuralPAL: 74,
        lowRuralPAL: 26,
      },
      maternity18To29: undefined,
      maternity30To59: {
        pregnantWomen: 0,
        lactatingWomen: 0,
      },
    })).toStrictEqual({
      group: {
        age: age.a30_59,
        sex: sex.Female,
        medianWeight: 76,
        population: 10,
      },
      perCapita: 2520,
      total: 25199,
    });
  });
  it('Varones', () => {
    expect(ERCalculator.calculate30To59Years({
      age: age.a30_59,
      sex: sex.Male,
      medianWeight: 83,
      population: 6,
    },
    [11.472, 873.1, 1.95, 1.65, 1.85, 1.55],
    {
      minorPAL: undefined,
      adultPAL: {
        urbanPercentage: 70,
        activeUrbanPAL: 36,
        lowUrbanPAL: 64,
        ruralPercentage: 30,
        activeRuralPAL: 74,
        lowRuralPAL: 26,
      },
      maternity18To29: undefined,
      maternity30To59: undefined,
    })).toStrictEqual({
      group: {
        age: age.a30_59,
        sex: sex.Male,
        medianWeight: 83,
        population: 6,
      },
      perCapita: 3143,
      total: 18861,
    });
  });
  it('Mujeres sin pasar data de maternidad', () => {
    expect(() => {
      ERCalculator.calculate18To29Years({
        age: age.a18_29,
        sex: sex.Female,
        medianWeight: 70,
        population: 10,
      },
      [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
      {
        minorPAL: undefined,
        adultPAL: {
          urbanPercentage: 70,
          activeUrbanPAL: 36,
          lowUrbanPAL: 64,
          ruralPercentage: 30,
          activeRuralPAL: 74,
          lowRuralPAL: 26,
        },
        maternity18To29: undefined,
        maternity30To59: undefined,
      });
    }).toThrow(Error('Missing maternity data for women aged 18 to 29'));
  });
  it('Hombres sin pasar data de NAF', () => {
    expect(() => {
      ERCalculator.calculate30To59Years({
        age: age.a30_59,
        sex: sex.Male,
        medianWeight: 70,
        population: 10,
      },
      [14.818, 486.6, 1.95, 1.65, 1.85, 1.55, 208, 251],
      {
        minorPAL: undefined,
        adultPAL: undefined,
        maternity18To29: undefined,
        maternity30To59: undefined,
      });
    }).toThrow(Error('Missing adults\' physical activity prevalence data'));
  });
});

describe('Verificar si funciona calculo del RE para personas de mas de 60 años', () => {
  it('Mujeres', () => {
    expect(ERCalculator.calculate60PlusYears({
      age: age.a60,
      sex: sex.Female,
      medianWeight: 70,
      population: 10,
    },
    [9.082, 658.5, 1.95, 1.65, 1.85, 1.55],
    {
      minorPAL: undefined,
      adultPAL: {
        urbanPercentage: 70,
        activeUrbanPAL: 36,
        lowUrbanPAL: 64,
        ruralPercentage: 30,
        activeRuralPAL: 74,
        lowRuralPAL: 26,
      },
      maternity18To29: undefined,
      maternity30To59: undefined,
    })).toStrictEqual({
      group: {
        age: age.a60,
        sex: sex.Female,
        medianWeight: 70,
        population: 10,
      },
      perCapita: 2229,
      total: 22289,
    });
  });
  it('Varones', () => {
    expect(ERCalculator.calculate60PlusYears({
      age: age.a60,
      sex: sex.Male,
      medianWeight: 75,
      population: 6,
    },
    [11.711, 587.7, 1.95, 1.65, 1.85, 1.55],
    {
      minorPAL: undefined,
      adultPAL: {
        urbanPercentage: 70,
        activeUrbanPAL: 36,
        lowUrbanPAL: 64,
        ruralPercentage: 30,
        activeRuralPAL: 74,
        lowRuralPAL: 26,
      },
      maternity18To29: undefined,
      maternity30To59: undefined,
    })).toStrictEqual({
      group: {
        age: age.a60,
        sex: sex.Male,
        medianWeight: 75,
        population: 6,
      },
      perCapita: 2525,
      total: 15149,
    });
  });
  it('Mujeres sin pasar data de NAF', () => {
    expect(() => {
      ERCalculator.calculate60PlusYears({
        age: age.a60,
        sex: sex.Female,
        medianWeight: 70,
        population: 10,
      },
      [9.082, 658.5, 1.95, 1.65, 1.85, 1.55],
      {
        minorPAL: undefined,
        adultPAL: undefined,
        maternity18To29: undefined,
        maternity30To59: undefined,
      });
    }).toThrow(Error('Missing adults\' physical activity prevalence data'));
  });
});
