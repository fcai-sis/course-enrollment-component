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
    .param("courseCode")

    .exists()
    .withMessage("Course code is required")

    .isString()
    .withMessage("Course code must be a valid string"),

  validateRequestMiddleware,
];

const validateFetchSemesterEnrollmentsMiddleware = middlewares;
export default validateFetchSemesterEnrollmentsMiddleware;
