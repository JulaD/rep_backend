import age from '../src/Enum/AgeBracket';
import sex from '../src/Enum/Sex';

const ERCalculator = require('../src/Services/ERCalculator');

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
