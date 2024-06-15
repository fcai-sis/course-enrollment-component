import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .body("finalExamScore")
    .exists()
    .withMessage("Final exam score is required")
    .isNumeric()
    .withMessage("Final exam score must be a number")
    .custom((value) => {
      if (value < 0 || value > 60) {
        throw new Error("Final exam score must be between 0 and 60");
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

    next();
  },
];

const updateFinalExamMiddleware = middlewares;
export default updateFinalExamMiddleware;
