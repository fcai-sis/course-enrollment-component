import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

const validateStudentPreferenceRequestMiddleware = [
  validator
    .body("preferences")
    .exists()
    .withMessage("Department preferences are required")
    .isArray({ min: 1 })
    .withMessage(
      "Department preferences must be an array with at least one department ID"
    ),
  validator
    .body("preferences.*")
    .isMongoId()
    .withMessage("Each department ID must be a valid MongoDB ID"),

  validateRequestMiddleware,
];

export default validateStudentPreferenceRequestMiddleware;
