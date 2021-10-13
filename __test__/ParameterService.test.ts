import '@testing-library/jest-dom/extend-expect';
import ParameterService from '../src/Services/ParameterService';

describe('Verificar si devuelve todos los pesos por defecto', () => {
  it('Pesos por defecto', async () => {
    expect((await ParameterService.getDefaultWeights()).length).toBe(12);
  });
});
