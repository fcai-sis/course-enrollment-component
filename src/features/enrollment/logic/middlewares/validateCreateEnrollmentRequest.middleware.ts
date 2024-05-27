import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import { CourseModel, SemesterModel } from "@fcai-sis/shared-models";
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

  validator
    .body("semesterId")
    .exists()
    .withMessage("Semester ID is required")
    .isMongoId()
    .withMessage("Invalid semester ID")
    .custom(async (value, { req }) => {
      // Ensure semester exists
      const semester = await SemesterModel.findById(value);

      if (!semester) throw new Error("Semester not found");

      // Check if the course is offered in this semester
      const course = req.body.courseToEnrollIn;
      if (!semester.courseIds.includes(course._id)) {
        throw new Error("Course not offered in this semester");
      }

      req.body.semesterId = semester;
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
