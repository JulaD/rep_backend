import * as XLSX from 'xlsx';

const parseExcel = (excelFile) => {
  XLSX.readFile(excelFile);
};

module.exports = {
  parseExcel,
};
