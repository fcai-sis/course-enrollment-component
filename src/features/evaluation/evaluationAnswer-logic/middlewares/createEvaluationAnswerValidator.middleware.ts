import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";

const createEvaluationAnswerValidatorMiddleware = [
    validator
        .body("questionId")
        .exists()
        .withMessage("Question ID is required")
        .isMongoId()
        .withMessage("Question ID must be a valid Mongo ID"),
    validator
        .body("enrollmentId")
        .exists()
        .withMessage("Enrollment ID is required")
        .isMongoId()
        .withMessage("Enrollment ID must be a valid Mongo ID"),
    validator
        .body("answer")
        .exists()
        .withMessage("Answer is required")
        .isInt({ min: 0, max: 5 }),

    (req: Request, res: Response, next: NextFunction) => {
        logger.debug(
            `Validating create evaluation answer validator middleware: ${JSON.stringify(
                req.body
            )}`
        );
        const errors = validator.validationResult(req);

        if (!errors.isEmpty()) {
            logger.debug(
                `Validation failed for create evaluation answer validator middleware: ${JSON.stringify(
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

export default createEvaluationAnswerValidatorMiddleware;
