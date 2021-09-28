import ParameterDTO from '../DTOs/ParameterDTO';
import ParameterType from '../Enum/ParameterType';

function csvToParameters(csv: string): ParameterDTO[] {
  const parameters: ParameterDTO[] = [];
  const lines: string[] = csv.split('\n');
  lines.forEach((parameter: string) => {
    const fields = parameter.split(',');
    parameters.push({
      id: fields[0],
      value: parseFloat(fields[1]),
      parameterType: fields[2] as ParameterType,
    });
  });
  return parameters;
}

export default { csvToParameters };
