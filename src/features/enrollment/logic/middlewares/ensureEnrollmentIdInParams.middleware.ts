import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("enrollment")

    .exists()
    .withMessage("Enrollment ID is required")

    .isMongoId()
    .withMessage("Enrollment ID must be a valid Mongo ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: [
          {
            message: errors.array()[0].msg,
          },
        ],
      });
    }

    req.params.enrollment = req.params.enrollment.trim();

    next();
  },
];

const ensureEnrollmentIdInParamsMiddleware = middlewares;
export default ensureEnrollmentIdInParamsMiddleware;
