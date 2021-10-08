import fs from 'fs';
import path from 'path';
import DefaultExtraDataDTO from '../DTOs/DefaultExtraDataDTO';
import DefaultWeightDTO from '../DTOs/DefaultWeightDTO';
import EquationConstantDTO from '../DTOs/EquationConstantDTO';
import DefaultExtraData from '../Models/DefaultExtraData';
import DefaultWeight from '../Models/DefaultWeight';
import EquationConstant from '../Models/EquationConstant';
import CSVParser from './CSVParser';

function initParameterDataBase(): void {
  let pathToFile: string = path.join(__dirname, 'DefaultWeightLoader.csv');
  let csv: string = fs.readFileSync(pathToFile, 'utf8').toString();
  const defaultWeights: DefaultWeightDTO[] = CSVParser.csvToDefaultWeight(csv);
  DefaultWeight.sync({ force: true }).then(() => {
    DefaultWeight.bulkCreate(defaultWeights, {
      updateOnDuplicate: ['value'],
    }).then(() => {
      console.log('Default Weight table loading success');
    })
      .catch((err) => {
        console.log(err);
      });
  });
  pathToFile = path.join(__dirname, 'DefaultExtraDataLoader.csv');
  csv = fs.readFileSync(pathToFile, 'utf8').toString();
  const extraData: DefaultExtraDataDTO[] = CSVParser.csvToDefaultExtraData(csv);
  DefaultExtraData.sync({ force: true }).then(() => {
    DefaultExtraData.bulkCreate(extraData, {
      updateOnDuplicate: ['value'],
    }).then(() => {
      console.log('Extra Data table loading success');
    })
      .catch((err) => {
        console.log(err);
      });
  });
  pathToFile = path.join(__dirname, 'EquationConstantLoader.csv');
  csv = fs.readFileSync(pathToFile, 'utf8').toString();
  const equationConstant: EquationConstantDTO[] = CSVParser.csvToEquationConstant(csv);
  EquationConstant.sync({ force: true }).then(() => {
    EquationConstant.bulkCreate(equationConstant, {
      updateOnDuplicate: ['value'],
    }).then(() => {
      console.log('Equation Constant table loading success');
    })
      .catch((err) => {
        console.log(err);
      });
  });
}

export default { initParameterDataBase };
