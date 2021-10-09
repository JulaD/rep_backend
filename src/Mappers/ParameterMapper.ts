import DefaultExtraDataDTO from '../DTOs/DefaultExtraDataDTO';
import DefaultWeightDTO from '../DTOs/DefaultWeightDTO';
import EquationConstantDTO from '../DTOs/EquationConstantDTO';
import ParameterType from '../Enum/ParameterType';
import DefaultExtraData from '../Models/DefaultExtraData';
import DefaultWeight from '../Models/DefaultWeight';
import EquationConstant from '../Models/EquationConstant';

function defaultExtraDataToDTO(parameter: DefaultExtraData): DefaultExtraDataDTO {
  const res: DefaultExtraDataDTO = {
    id: parameter.id,
    value: parameter.value,
    parameterType: parameter.parameterType,
    order: parameter.order,
    description: parameter.description,
  };
  return res;
}

function equationConstantToDTO(parameter: EquationConstant): EquationConstantDTO {
  const res: EquationConstantDTO = {
    value: parameter.value,
    parameterType: parameter.parameterType,
    order: parameter.order,
    description: parameter.description,
    ageRange: parameter.ageRange,
    sex: parameter.sex,
  };
  return res;
}

function defaultWeightToDTO(parameter: DefaultWeight): DefaultWeightDTO {
  const res: DefaultWeightDTO = {
    value: parameter.value,
    ageRange: parameter.ageRange,
    sex: parameter.sex,
    parameterType: ParameterType.DefaultWeight,
  };
  return res;
}

export default { defaultExtraDataToDTO, equationConstantToDTO, defaultWeightToDTO };
