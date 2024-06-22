import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import { CourseModel, HallModel } from "@fcai-sis/shared-models";
import * as validator from "express-validator";

const middlewares = [
  validator
    .body("minValue")
    .exists()
    .withMessage("Min value is required")
    .isNumeric()
    .withMessage("Min value must be a number"),

  validator
    .body("maxValue")
    .exists()
    .withMessage("Max value is required")
    .isNumeric()
    .withMessage("Max value must be a number"),

  validator
    .body("course")
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

  validator
    .body("hall")
    .exists()
    .withMessage("Hall ID is required")
    .isMongoId()
    .withMessage("Hall ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

const validateAssignHallRequestMiddleware = middlewares;
export default validateAssignHallRequestMiddleware;
