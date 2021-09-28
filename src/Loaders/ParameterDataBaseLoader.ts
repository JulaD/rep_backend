import fs from 'fs';
import ParameterDTO from '../DTOs/ParameterDTO';
import Parameter from '../Models/Parameter';
import CSVParser from './CSVParser';

function initParameterDataBase(): void {
  const csv: string = fs.readFileSync('/loader.csv').toString();
  const parameters: ParameterDTO[] = CSVParser.csvToParameters(csv);
  Parameter.bulkCreate(parameters);
}

export default { initParameterDataBase };
