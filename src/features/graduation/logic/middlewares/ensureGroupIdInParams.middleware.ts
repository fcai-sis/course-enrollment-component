import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("groupId")

    .exists()
    .withMessage("Group ID is required")

    .isMongoId()
    .withMessage("Group ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

const ensureGroupIdInParamsMiddleware = middlewares;
export default ensureGroupIdInParamsMiddleware;
