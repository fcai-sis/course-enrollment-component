import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const middlewares = [
  validator
    .body("finalExamMark")

    .optional()
    .isNumeric()
    .withMessage("Final exam score must be a number"),

  validator
    .body("termWorkMark")

    .optional()
    .isNumeric()
    .withMessage("Term work score must be a number"),

  validateRequestMiddleware,
];

const updateGradesRequestMiddleware = middlewares;
export default updateGradesRequestMiddleware;
