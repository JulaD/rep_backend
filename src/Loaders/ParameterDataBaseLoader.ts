import fs from 'fs';
import path from 'path';
import ParameterDTO from '../DTOs/ParameterDTO';
import Parameter from '../Models/Parameter';
import CSVParser from './CSVParser';

function initParameterDataBase(): void {
  const pathToFile: string = path.join(__dirname, 'loader.csv');
  const csv: string = fs.readFileSync(pathToFile, 'utf8').toString();
  const parameters: ParameterDTO[] = CSVParser.csvToParameters(csv);
  Parameter.sync({ force: true }).then(() => {
    Parameter.bulkCreate(parameters, {
      updateOnDuplicate: ['value'],
    }).then(() => {
      console.log('DataBase initialization success');
    })
      .catch((err) => {
        console.log(err);
      });
  });
}

export default { initParameterDataBase };
