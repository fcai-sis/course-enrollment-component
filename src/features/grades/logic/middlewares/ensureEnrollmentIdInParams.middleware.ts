import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("enrollmentId")

    .exists()
    .withMessage("Enrollment ID is required")

    .isMongoId()
    .withMessage("Enrollment ID must be a valid Mongo ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.params.enrollmentId = req.params.enrollmentId.trim();

    next();
  },
];

const ensureEnrollmentIdInParamsMiddleware = middlewares;
export default ensureEnrollmentIdInParamsMiddleware;
