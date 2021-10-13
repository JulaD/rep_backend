import '@testing-library/jest-dom/extend-expect';
import AgeBracket from '../src/Enum/AgeBracket';
import Sex from '../src/Enum/Sex';
import ParameterService from '../src/Services/ParameterService';

describe('Verificar si devuelve los parametros correctamente', () => {
  it('Pesos por defecto', async () => {
    expect((await ParameterService.getDefaultWeights()).length).toBe(64);
  });
  it('Datos Extra', async () => {
    expect((await ParameterService.getDefaultExtraData()).length).toBe(13);
  });
  it('Constantes de ecuacion', async () => {
    expect(new Set(await ParameterService.getEquationValues(AgeBracket.a1, Sex.Male)))
      .toEqual(new Set([310.2, 63.3, -0.263, 13]));
  });
  it('Constantes de ecuacion', async () => {
    expect(new Set(await ParameterService.getEquationValues(AgeBracket.a10, Sex.Female)))
      .toEqual(new Set([263.4, 65.3, -0.454, 25, -15, 15]));
  });
});
