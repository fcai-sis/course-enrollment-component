import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const middlewares = [
  validator
    .body("grades")

    .exists()
    .withMessage("Grades are required")

    .isObject()
    .withMessage("Grades must be an object"),

  validator
    .body("grades.finalExam")

    .optional()
    .isNumeric()
    .withMessage("Final exam score must be a number"),

  validator
    .body("grades.termWork")

    .optional()
    .isNumeric()
    .withMessage("Term work score must be a number"),

  validateRequestMiddleware,
];

const updateGradesRequestMiddleware = middlewares;
export default updateGradesRequestMiddleware;
