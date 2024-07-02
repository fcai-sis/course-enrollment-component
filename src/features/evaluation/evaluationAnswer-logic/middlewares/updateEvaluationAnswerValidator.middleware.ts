import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";

const updateEvaluationAnswerValidatorMiddleware = [
  validator
    .body("questionId")
    .optional()
    .isMongoId()
    .withMessage("Question ID must be a valid Mongo ID"),
  validator
    .body("answer")
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage("Answer must be a number between 0 and 5"),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating update evaluation answer validator middleware: ${JSON.stringify(
        req.body
      )}`
    );
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for update evaluation answer validator middleware: ${JSON.stringify(
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

export default updateEvaluationAnswerValidatorMiddleware;
