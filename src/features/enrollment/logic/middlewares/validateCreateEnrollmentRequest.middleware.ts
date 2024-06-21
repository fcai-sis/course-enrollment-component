import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

/*
 * Middleware to validate the request body for creating an enrollment
 *
 * Attaches the student and course to enroll in to the request body
 **/
const validateCreateEnrollmentRequestMiddleware = [
  validator
    .body("courseCode")

    .exists()
    .withMessage("Course code is required"),

  validateRequestMiddleware,
];

export default validateCreateEnrollmentRequestMiddleware;
