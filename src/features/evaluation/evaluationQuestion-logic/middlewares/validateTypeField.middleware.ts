import * as validator from "express-validator";
import { QuestionTypes } from "../../data/enums/questionTypes.enum";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

const validateTypeFieldMiddleware = [
  validator
    .body("type")

    .optional()

    .isString()
    .withMessage("Type must be a string")

    .isIn(Object.values(QuestionTypes))
    .withMessage("Type must be one of the values in the enum"),

  validateRequestMiddleware,
];

export default validateTypeFieldMiddleware;
