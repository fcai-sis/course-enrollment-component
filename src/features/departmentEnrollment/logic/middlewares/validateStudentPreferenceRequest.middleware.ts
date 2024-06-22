import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";

const validateStudentPreferenceRequestMiddleware = [
  validator
    .body("studentId")
    .exists()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Student ID must be a valid MongoDB ID"),
  validator
    .body("preferences")
    .exists()
    .withMessage("Department preferences are required")
    .isArray({ min: 1 })
    .withMessage("Department preferences must be an array with at least one department ID"),
  validator
    .body("preferences.*")
    .isMongoId()
    .withMessage("Each department ID must be a valid MongoDB ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    next();
  },
];

export default validateStudentPreferenceRequestMiddleware;
