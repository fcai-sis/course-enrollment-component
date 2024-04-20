import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("groupId")

    .exists()
    .withMessage("Group ID is required")

    .isMongoId()
    .withMessage("Group ID must be a valid Mongo ID"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.params.groupId = req.params.groupId.trim();

    next();
  },
];

const ensureGroupIdInParamsMiddleware = middlewares;
export default ensureGroupIdInParamsMiddleware;
