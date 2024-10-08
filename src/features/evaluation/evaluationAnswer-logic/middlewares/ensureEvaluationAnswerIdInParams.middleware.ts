import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("evaluationAnswerId")

    .exists()
    .withMessage("Answer ID is required")

    .isMongoId()
    .withMessage("Answer ID must be a valid Mongo ID"),

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

    req.params.evaluationAnswerId = req.params.evaluationAnswerId.trim();

    next();
  },
];

const ensureEvaluationAnswerIdInParamsMiddleware = middlewares;
export default ensureEvaluationAnswerIdInParamsMiddleware;
