import { NextFunction, Request, Response } from "express";

import logger from "../../../../core/logger";

/**
 * Ensures that there is a file uploaded in the request object.
 *
 * @returns `400 Bad Request` if there is no file uploaded
 */
const ensureFileUploadedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    logger.debug(`No file uploaded`);

    res.status(400).json({
      errors: [
        {
          message: "File is required",
        },
      ],
    });
    return;
  }

  logger.debug(`File uploaded`);

  next();
};

export default ensureFileUploadedMiddleware;
