import { Workbook } from "exceljs";
import { Request, Response, NextFunction } from "express";

import logger from "../../../../core/logger";
import ExcelRow from "../../data/types/excelRow.type";
import { getExcelColumnsHeaders, getExcelRows, getStudentsWorkSheet, rowsToStudents } from "../../../utils/excel.utils";

type MiddlewareRequest = Request<
  {},
  {},
  {
    workbook: Workbook;
    grades: ExcelRow[];
    excelColumnsHeaders: string[];
  }
>;

/**
 * Reads the students from the uploaded Excel file,
 * and attaches the students and the Excel columns headers to the request object.
 */
const readStudentsFromExcelMiddleware = async (
  req: MiddlewareRequest,
  _: Response,
  next: NextFunction
) => {
  const workbook = req.body.workbook;
  const worksheet = getStudentsWorkSheet(workbook);
  const excelRows = getExcelRows(worksheet);
  const excelColumnsHeaders = getExcelColumnsHeaders(worksheet);

  req.body.grades = rowsToStudents(excelRows, excelColumnsHeaders);
  req.body.excelColumnsHeaders = excelColumnsHeaders;

  logger.debug(
    `Read ${excelRows.length} students from the uploaded Excel file`
  );
  logger.debug(`Excel columns headers: ${excelColumnsHeaders}`);

  next();
};

export default readStudentsFromExcelMiddleware;
