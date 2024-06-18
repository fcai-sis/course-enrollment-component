import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .body("scores")
    .exists()
    .withMessage("Scores are required")
    .isArray()
    .withMessage("Scores must be an array"),

  validator
    .body("scores.*.description")
    .exists()
    .withMessage("Score description is required")
    .isString()
    .withMessage("Score description must be a string"),

  validator
    .body("scores.*.score")
    .exists()
    .withMessage("Score is required")
    .isNumeric()
    .withMessage("Score must be a number"),

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

const addScoreRequestMiddleware = middlewares;
export default addScoreRequestMiddleware;
