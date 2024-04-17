import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";

import logger from "../../../../core/logger";
import { EnrollmentModel } from "../../data/models/enrollment.model";

// Middleware chain
const middlewares = [
  validator.param("studentId").isString().withMessage("Invalid student ID"),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating get passed courses req: ${JSON.stringify(req.body)}`
    );

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
    const passedCourses : any = [];

    const { studentId } = req.params;

    // Get all enrollments with this student ID that have the course status marked as "passed"
    const enrollments = await EnrollmentModel.find({
      studentId,
      status: "passed",
    });

    // Append the course ID to the passedCourses array
    enrollments.forEach((enrollment) => {
      passedCourses.push(enrollment.courseId);
    });
    
   

    // Add the passed courses to the request body
    req.body = {
      ...req.body,
      passedCourses,
    };

    next();
  },
];

const getPassedCoursesMiddleware = middlewares;
export default getPassedCoursesMiddleware;
