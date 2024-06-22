import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import { CourseModel, SemesterModel } from "@fcai-sis/shared-models";
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
    .param("courseId")

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

  validateRequestMiddleware,
];

const validateFetchSemesterEnrollmentsMiddleware = middlewares;
export default validateFetchSemesterEnrollmentsMiddleware;
