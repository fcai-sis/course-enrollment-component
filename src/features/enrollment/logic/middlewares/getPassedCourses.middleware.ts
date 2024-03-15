import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";

import logger from "../../../../core/logger";
import { EnrollmentModel } from "../../data/models/enrollment.model";

// Middleware chain
const middlewares = [
  validator
    .param("studentId")
    .isString()
    .withMessage("Invalid student ID"),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(`Validating get passed courses req: ${JSON.stringify(req.body)}`);

    // If any of the validations above failed, return an error response
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for get passed courses req: ${JSON.stringify(
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

  async (req: Request, _: Response, next: NextFunction) => {
    const passedCourses = [];

    const { studentId } = req.params;

    // Get the student's enrollment object if it exists
    const existingEnrollment = await EnrollmentModel.findOne({ studentId });
  },
];

const getPassedCoursesMiddleware = middlewares;
export default getPassedCoursesMiddleware;
