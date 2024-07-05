import fs from "fs";
import Excel, { Workbook } from "exceljs";
import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";

type HandlerRequest = Request<{}, {}, { workbook: Workbook }>;

/**
 * Checks if the file uploaded is a valid excel file.
 *
 * It assumes that the file has already been uploaded in the `req.file` object
 *
 * Attaches the Excel workbook to the request object.
 *
 * @returns `400 Bad Request` if the uploaded file is not a valid excel file
 */
const ensureFileIsExcelMiddleware = async (
  req: HandlerRequest,
  res: Response,
  next: NextFunction
) => {
  logger.debug(`Checking if the uploaded file is a valid excel file`);

  // Read the uploaded Excel file
  const buffer = fs.readFileSync(req.file!.path);

  try {
    // Parse the file, if the parsing is successful, the file is a valid excel file
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    logger.debug(`Uploaded file is a valid excel file`);

    // Attach the workbook to the request object
    req.body.workbook = workbook;
  } catch (e) {
    logger.debug(`Uploaded file is NOT a valid excel file`);

    // If the parsing failed, the file is not a valid excel file
    res.status(400).json({
      errors: [
        {
          message: "File must be an excel file",
        },
      ],
    });

    return;
  }

  next();
};

export default ensureFileIsExcelMiddleware;
