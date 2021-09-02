import * as XLSX from 'xlsx';

const parseExcel = (excelFile: string) => {
  XLSX.readFile(excelFile);
};

module.exports = {
  parseExcel,
};
