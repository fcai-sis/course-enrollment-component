import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import * as validator from "express-validator";

const middlewares = [
  validator
    .param("enrollmentId")

    .exists()
    .withMessage("Enrollment ID is required")

    .isMongoId()
    .withMessage("Enrollment ID must be a valid Mongo ID"),

  validateRequestMiddleware,
];

const ensureEnrollmentIdInParamsMiddleware = middlewares;
export default ensureEnrollmentIdInParamsMiddleware;
