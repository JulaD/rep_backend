import DefaultExtraDataDTO from '../DTOs/DefaultExtraDataDTO';
import DefaultWeightDTO from '../DTOs/DefaultWeightDTO';
import EquationConstantDTO from '../DTOs/EquationConstantDTO';
import AgeBracket from '../Enum/AgeBracket';
import ParameterType from '../Enum/ParameterType';
import Sex from '../Enum/Sex';

function csvToDefaultWeight(csv: string): DefaultWeightDTO[] {
  const parameters: DefaultWeightDTO[] = [];
  const lines: string[] = csv.split('\r\n');
  lines.forEach((parameter: string) => {
    const fields = parameter.split(',');
    parameters.push({
      ageRange: fields[0] as AgeBracket,
      value: parseFloat(fields[1]),
      sex: fields[2] as Sex,
    });
  });
  parameters.shift();
  parameters.pop();
  return parameters;
}

function csvToDefaultExtraData(csv: string): DefaultExtraDataDTO[] {
  const parameters: DefaultExtraDataDTO[] = [];
  const lines: string[] = csv.split('\r\n');
  lines.forEach((parameter: string) => {
    const fields = parameter.split(',');
    parameters.push({
      id: fields[0],
      value: parseFloat(fields[1]),
      parameterType: fields[2] as ParameterType,
      order: parseInt(fields[3], 10),
      description: fields[4],
    });
  });
  parameters.shift();
  parameters.pop();
  return parameters;
}

function csvToEquationConstant(csv: string): EquationConstantDTO[] {
  const parameters: EquationConstantDTO[] = [];
  const lines: string[] = csv.split('\r\n');
  lines.forEach((parameter: string) => {
    const fields = parameter.split(',');
    parameters.push({
      ageRange: fields[0] as AgeBracket,
      value: parseFloat(fields[1]),
      parameterType: fields[2] as ParameterType,
      sex: fields[3] as Sex,
      order: parseInt(fields[4], 10),
      description: fields[5],
    });
  });
  parameters.shift();
  parameters.pop();
  return parameters;
}

export default { csvToDefaultWeight, csvToDefaultExtraData, csvToEquationConstant };
