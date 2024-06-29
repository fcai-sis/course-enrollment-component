import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";
import { QuestionTypes } from "../../data/enums/questionTypes.enum";

const createEvaluationQuestionValidatorMiddleware = [
  validator
    .body("evaluationQuestion.question.en")
    .exists()
    .withMessage("English question is required")
    .isString()
    .withMessage("English question must be a string"),

    validator
    .body("evaluationQuestion.question.ar")
    .exists()
    .withMessage("Arabic question is required")
    .isString()
    .withMessage("Arabic question must be a string"),
  validator
    .body("evaluationQuestion.type")
    .exists()
    .withMessage("Type is required")
    .isString()
    .withMessage("Type must be a string")
    .isIn(Object.values(QuestionTypes)),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating create evaluation question validator middleware: ${JSON.stringify(
        req.body
      )}`
    );
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for create evaluation question validator middleware: ${JSON.stringify(
          req.body
        )}`
      );

      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }
    next();
  },
];

export default createEvaluationQuestionValidatorMiddleware;
