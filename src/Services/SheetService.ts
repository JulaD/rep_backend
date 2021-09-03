import * as XLSX from 'xlsx';

/* PRIVATE FUNCTIONS */
const ec = (r: number, c: number): string => XLSX.utils.encode_cell({ r, c });
const deleteRow = (ws: XLSX.WorkSheet, rowIndex: number): XLSX.WorkSheet => {
  const work = ws;
  if (work['!ref'] === undefined) throw new Error('An error has ocurred in deleteRow');
  const variable = XLSX.utils.decode_range(work['!ref']);
  for (let R = rowIndex; R < variable.e.r; R += 1) {
    for (let C = variable.s.c; C <= variable.e.c; C += 1) {
      work[ec(R, C)] = work[ec(R + 1, C)];
    }
  }
  variable.e.r -= 1;
  work['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
  return work;
};

/* EXPORT FUNCTIONS */

const parseSheetService = (data: Buffer): JSON => {
  const workbook: XLSX.WorkBook = XLSX.read(data);
  let parsed: JSON = JSON.parse('{}');

  const sheetName = workbook.SheetNames[0];
  const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

  const ref = worksheet['!ref'];
  if (ref === undefined) throw new Error('An error has ocurred in parseSheetService');
  const range = XLSX.utils.decode_range(ref);
  range.s.c = 0; // 0 == XLSX.utils.decode_col("A")
  range.e.c = 1; // 1 == XLSX.utils.decode_col("B")
  const newRange = XLSX.utils.encode_range(range);
  const workSheetWithRowDeleted: XLSX.WorkSheet = deleteRow(worksheet, 0);
  // eslint-disable-next-line max-len
  parsed = XLSX.utils.sheet_to_json(workSheetWithRowDeleted, { range: newRange }) as unknown as JSON;

  return parsed;
  // TODO: depends on sheet layout what to do
};

export default {
  parseSheetService,
};
