import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";
import { QuestionTypes } from "../../data/enums/questionTypes.enum";

const updateEvaluationQuestionValidatorMiddleware = [
  validator
    .body("question")
    .optional()
    .isString()
    .withMessage("Question must be a string"),
  validator
    .body("type")
    .optional()
    .isString()
    .withMessage("Type must be a string")
    .isIn(Object.values(QuestionTypes)),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating update evaluation question validator middleware: ${JSON.stringify(
        req.body
      )}`
    );
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for update evaluation question validator middleware: ${JSON.stringify(
          req.body
        )}`
      );

      return res.status(400).json({
        errors: [
          {
            message: errors.array()[0].msg,
          },
        ],
      });
    }
    next();
  },
];

export default updateEvaluationQuestionValidatorMiddleware;
