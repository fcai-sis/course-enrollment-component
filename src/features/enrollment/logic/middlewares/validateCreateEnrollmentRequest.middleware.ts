import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import { CourseModel, StudentModel } from "@fcai-sis/shared-models";
import logger from "../../../../core/logger";

const validateCreateEnrollmentRequestMiddleware = [
  validator
    .body("studentId")
    .exists()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid student ID")
    .custom(async (value, { req }) => {
      // Fetch the student
      const student = await StudentModel.findById(value);

      if (!student) {
        throw new Error("Student not found");
      }

      req.body.student = student;

      return true;
    }),

  validator
    .body("courses")
    .exists()
    .withMessage("Courses to enroll in is required")
    .isArray()
    .withMessage("At least one course is required")
    .custom((_, { req }) => {
      req.body.coursesToEnrollIn = [];

      return true;
    }),

  validator
    .body("courses.*")
    .custom((value) => {
      // Course code must follow this pattern: 2-4 uppercase letters followed by 3 digits
      const pattern = /^[A-Z]{2,4}\d{3}$/;
      if (!pattern.test(value)) {
        throw new Error(
          "Invalid course code, must be 2-4 uppercase letters followed by 3 digits"
        );
      }

      return true;
    })
    .withMessage("Invalid course code")
    .custom(async (value, { req }) => {
      // Fetch the course
      const course = await CourseModel.findOne({ code: value });

      if (!course) {
        throw new Error("Course not found");
      }

      req.body.coursesToEnrollIn.push(course);

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
