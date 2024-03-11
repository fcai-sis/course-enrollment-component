import logger from "../../../../core/logger";
import { Request, Response, NextFunction } from "express";

import * as validator from "express-validator";
import { CourseEnrollmentModel } from "../../data/models/enrollment.model";

// Custom validation function for studentId
const validateStudentId = validator
  .param("studentId")
  .isString()
  .withMessage("Invalid student ID");

// Middleware to fetch passedCourses
const fetchPassedCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { studentId } = req.params;

  const passedCourses = await CourseEnrollmentModel.find({
    student: studentId,
    "courses.status": "passed",
  }).populate("courses.courseId");

  if (!passedCourses || passedCourses.length === 0) {
    throw new Error("No courses found");
  }

  const courseIds = passedCourses
    .map((enrollment) => {
      return enrollment.courses.map((course) => course.courseId);
    })
    .flat();
  // console.log(courseIds);

  //@ts-ignore
  req.passedCourses = courseIds;

  next();
};

// Middleware chain
const middlewares = [
  validateStudentId,
  fetchPassedCourses,
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
];

const getPassedCoursesMiddleware = middlewares;
export default getPassedCoursesMiddleware;
