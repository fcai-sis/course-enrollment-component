import { CourseModel, SemesterModel } from "@fcai-sis/shared-models";
import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .body("semesterId")
    .optional()

    .isMongoId()
    .withMessage("Semester ID must be a valid Mongo ID")
    .custom(async (value) => {
      // Check if the semester exists
      const semester = await SemesterModel.findById(value);

      if (!semester) {
        throw new Error("Semester not found");
      }

      return true;
    }),

  validator
    .body("courseId")

    .exists()
    .withMessage("Course ID is required")

    .isMongoId()
    .withMessage("Course ID must be a valid Mongo ID")
    .custom(async (value) => {
      // Check if the course exists
      const course = await CourseModel.findById(value);

      if (!course) {
        throw new Error("Course not found");
      }

      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.params.semesterId = req.params.semesterId.trim();

    next();
  },
];

const validateFetchSemesterEnrollmentsMiddleware = middlewares;
export default validateFetchSemesterEnrollmentsMiddleware;
