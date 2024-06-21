import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

/*
 * Middleware to validate the request body for enrolling into multiple courses
 *
 **/
const validateEnrollInCoursesRequestMiddleware = [
  validator
    .body("coursesToEnrollIn")
    .exists()
    .withMessage("Course codes are required")
    .isArray({ min: 1 })
    .withMessage("Must be an array of at least 1 course code"),

  validator
    .body("coursesToEnrollIn.*.courseCode")
    .exists()
    .withMessage("Course code is required")
    .isString()
    .withMessage("Course code must be a string"),

  validateRequestMiddleware,
];

export default validateEnrollInCoursesRequestMiddleware;
