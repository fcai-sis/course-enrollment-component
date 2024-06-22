import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";
import { QuestionTypes } from "../../data/enums/questionTypes.enum";

const validateTypeFieldMiddleware = [
    validator
        .body("type")
        .optional()
        .isString()
        .withMessage("Type must be a string")
        .isIn(Object.values(QuestionTypes))
        .withMessage("Type must be one of the values in the enum"),
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

export default validateTypeFieldMiddleware;
    

