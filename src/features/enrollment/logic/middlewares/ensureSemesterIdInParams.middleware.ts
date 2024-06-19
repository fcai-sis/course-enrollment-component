import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("semesterId")

    .exists()
    .withMessage("Semester ID is required")

    .isMongoId()
    .withMessage("Semester ID must be a valid Mongo ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.params.semesterId = req.params.semesterId.trim();

    next();
  },
];

const ensureSemesterIdInParamsMiddleware = middlewares;
export default ensureSemesterIdInParamsMiddleware;
