import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";
import { EnrollmentModel } from "@fcai-sis/shared-models";

const ensureEnrollmentExistsMiddleware = [
  validator
    .body("studentId")
    .exists()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid student ID")
    .custom(async (value) => {
      // Get the student's enrollment object if it exists
      const existingEnrollment = await EnrollmentModel.findOne({
        studentId: value,
      });
      if (!existingEnrollment) {
        throw new Error("Enrollment not found");
      }

      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating ensure enrollment exists middleware: ${JSON.stringify(
        req.body
      )}`
    );
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for ensure enrollment exists middleware: ${JSON.stringify(
          req.body
        )}`
      );

      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    next();
  },
];

export default ensureEnrollmentExistsMiddleware;
