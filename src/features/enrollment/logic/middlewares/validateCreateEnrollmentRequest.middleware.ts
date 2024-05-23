import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import { CourseModel } from "@fcai-sis/shared-models";
import logger from "../../../../core/logger";

/*
 * Middleware to validate the request body for creating an enrollment
 *
 * Attaches the student and course to enroll in to the request body
 **/
const validateCreateEnrollmentRequestMiddleware = [
  validator
    .body("courseCode")
    .exists()
    .withMessage("Course code is required")
    .custom(async (value, { req }) => {
      // Ensure course exists
      const course = await CourseModel.findOne({ code: value });

      if (!course) throw new Error("Course not found");

      req.body.courseToEnrollIn = course;

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

export default validateCreateEnrollmentRequestMiddleware;
