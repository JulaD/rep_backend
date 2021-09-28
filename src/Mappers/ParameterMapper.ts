import ParameterDTO from '../DTOs/ParameterDTO';
import Parameter from '../Models/Parameter';

function parameterToData(parameter: Parameter): ParameterDTO {
  const res: ParameterDTO = {
    id: parameter.id,
    value: parameter.value,
    parameterType: parameter.parameterType,
  };
  return res;
}

export default { parameterToData };
