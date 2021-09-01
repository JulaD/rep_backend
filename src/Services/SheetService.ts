/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import * as XLSX from "xlsx";

/* PRIVATE FUNCTIONS */
const ec = (r:any, c:any) => XLSX.utils.encode_cell({ r, c });
const deleteRow = (ws:any, rowIndex:any) => {
  const variable = XLSX.utils.decode_range(ws["!ref"]);
  for (let R = rowIndex; R < variable.e.r; ++R) {
    for (let C = variable.s.c; C <= variable.e.c; ++C) {
      ws[ec(R, C)] = ws[ec(R + 1, C)];
    }
  }
  variable.e.r--;
  ws["!ref"] = XLSX.utils.encode_range(variable.s, variable.e);
};

/* EXPORT FUNCTIONS */
export const parseExcelService = () => {
  const workbook = XLSX.readFile("src\\Services\\test.xlsx");
  // TODO: need definition of sheet
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const ref = worksheet["!ref"]!;
    const range = XLSX.utils.decode_range(ref);
    range.s.c = 0; // 0 == XLSX.utils.decode_col("A")
    range.e.c = 1; // 6 == XLSX.utils.decode_col("B")
    const newRange = XLSX.utils.encode_range(range);
    deleteRow(worksheet, 0);
    const parsed = XLSX.utils.sheet_to_json(worksheet, { range: newRange });
    console.log(parsed);
    return parsed;
  });
};
