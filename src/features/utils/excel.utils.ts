import { Worksheet, Workbook } from "exceljs";
import ExcelRow from "../grades/data/types/excelRow.type";

export function getExcelColumnsHeaders(worksheet: Worksheet): string[] {
  const headers = worksheet.getRow(1).values as (string | undefined)[];
  return headers.splice(1) as string[]; // TODO: handle nightmare scenarios
}

// Get the first worksheet in the workbook (assuming the first sheet contains the students data)
export const getStudentsWorkSheet = (workbook: Workbook): Worksheet =>
  workbook.getWorksheet(1)!; // TODO: handle no worksheet

export function getExcelRows(worksheet: Worksheet): any[][] {
  const rows = worksheet.getRows(2, worksheet.rowCount) as ExcelRow[];
  return rows
    .map((row) => row.values.splice(1) as string[])
    .splice(0, rows.length - 1);
}

export function rowsToStudents(
  rows: any[][],
  columnsHeaders: string[]
): ExcelRow[] {
  return rows.map((row) => {
    const student: ExcelRow = {};
    columnsHeaders.forEach((header, index) => {
      student[header] = row[index];
    });
    return student;
  });
}
