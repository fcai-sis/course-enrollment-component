import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import {
  EnrollmentModel,
  EnrollmentStatus,
  Hall,
} from "@fcai-sis/shared-models";
import logger from "../../../../core/logger";

/*
 * Middleware to validate the request body for updating an enrollment
 *
 * Attaches the enrollment and exam hall (if it exists) to the request body
 **/
const validateUpdateEnrollmentRequestBodyMiddleware = [
  validator
    .body("enrollment")
    .exists()
    .withMessage("Enrollment is required")
    .custom(async (value, { req }) => {
      // Ensure enrollment exists
      const enrollment = await EnrollmentModel.findOne({ _id: value });

      if (!enrollment) throw new Error("Enrollment not found");

      return true;
    }),

  validator
    .body("status")
    .optional()
    .isIn(["passed", "failed", "enrolled"] as EnrollmentStatus[])
    .withMessage("Invalid status"),

  validator
    .body("seatNumber")
    .optional()
    .isNumeric()
    .withMessage("Seat number must be a number"),

  validator
    .body("examHall")
    .optional()
    .isMongoId()
    .withMessage("Invalid exam hall ID")
    .custom(async (value, { req }) => {
      // Ensure exam hall exists
      const examHall = await Hall.findOne({ _id: value });

      if (!examHall) throw new Error("Exam hall not found");

      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating create enrollment req body: ${JSON.stringify(req.body)}`
    );
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for create enrollment req body: ${JSON.stringify(
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

export default validateUpdateEnrollmentRequestBodyMiddleware;
