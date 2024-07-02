import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("evaluationQuestionId")

    .exists()
    .withMessage("Question ID is required")

    .isMongoId()
    .withMessage("Question ID must be a valid Mongo ID"),

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

    req.params.evaluationQuestionId = req.params.evaluationQuestionId.trim();

    next();
  },
];

const ensureEvaluationQuestionIdInParamsMiddleware = middlewares;
export default ensureEvaluationQuestionIdInParamsMiddleware;
