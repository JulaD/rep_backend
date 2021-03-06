/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import DefaultExtraDataDTO from '../DTOs/DefaultExtraDataDTO';
import DefaultWeightDTO from '../DTOs/DefaultWeightDTO';
import EquationConstantDTO from '../DTOs/EquationConstantDTO';
import Auditor from '../Models/Auditor';
import CalculationAuditor from '../Models/CalculationAuditor';
import DefaultExtraData from '../Models/DefaultExtraData';
import DefaultWeight from '../Models/DefaultWeight';
import EquationConstant from '../Models/EquationConstant';
import FAQ from '../Models/FAQ';
import CSVParser from './CSVParser';

async function initParameterDataBase(): Promise<void> {
  let pathToFile: string = path.join(__dirname, 'DefaultWeightLoader.csv');
  let csv: string = fs.readFileSync(pathToFile, 'utf8').toString();
  const defaultWeights: DefaultWeightDTO[] = CSVParser.csvToDefaultWeight(csv);
  await DefaultWeight.sync({ force: true }).then(() => {
    DefaultWeight.bulkCreate(defaultWeights, {
      updateOnDuplicate: ['value'],
    }).then(() => {
      console.log('Default Weight table loading success');
    })
      .catch((err) => {
        console.error(err);
      });
  });
  pathToFile = path.join(__dirname, 'DefaultExtraDataLoader.csv');
  csv = fs.readFileSync(pathToFile, 'utf8').toString();
  const extraData: DefaultExtraDataDTO[] = CSVParser.csvToDefaultExtraData(csv);
  await DefaultExtraData.sync({ force: true }).then(() => {
    DefaultExtraData.bulkCreate(extraData, {
      updateOnDuplicate: ['value'],
    }).then(() => {
      console.log('Extra Data table loading success');
    })
      .catch((err) => {
        console.error(err);
      });
  });
  pathToFile = path.join(__dirname, 'EquationConstantLoader.csv');
  csv = fs.readFileSync(pathToFile, 'utf8').toString();
  const equationConstant: EquationConstantDTO[] = CSVParser.csvToEquationConstant(csv);
  await EquationConstant.sync({ force: true }).then(() => {
    EquationConstant.bulkCreate(equationConstant, {
      updateOnDuplicate: ['value'],
    }).then(() => {
      console.log('Equation Constant table loading success');
    })
      .catch((err) => {
        console.error(err);
      });
  });
  FAQ.sync({ force: true });
  Auditor.sync({ force: false });
  CalculationAuditor.sync({ force: false });
}

export default { initParameterDataBase };
