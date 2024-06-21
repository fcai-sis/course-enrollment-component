import * as validator from "express-validator";
import { EnrollmentStatusEnum, HallModel } from "@fcai-sis/shared-models";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

/*
 * Middleware to validate the request body for updating an enrollment
 *
 * Attaches the enrollment and exam hall (if it exists) to the request body
 **/
const validateUpdateEnrollmentRequestBodyMiddleware = [
  validator
    .body("enrollment")
    .exists()
    .withMessage("Enrollment is required")
    .isMongoId()
    .withMessage("Invalid enrollment ID"),

  validator
    .body("status")
    .optional()
    .isIn(Object.values(EnrollmentStatusEnum))
    .withMessage("Invalid status"),

  validator
    .body("exam")
    .optional()
    .isObject()
    .withMessage("Exam must be an object"),

  validator
    .body("exam.hall")
    .optional()
    .isMongoId()
    .withMessage("Invalid exam hall ID")
    .custom(async (value) => {
      // Ensure exam hall exists
      const examHall = await HallModel.findOne({ _id: value });

      if (!examHall) throw new Error("Hall not found");

      return true;
    }),
  validator
    .body("exam.seatNumber")
    .optional()
    .isNumeric()
    .withMessage("Seat number must be a number"),

  validateRequestMiddleware,
];

export default validateUpdateEnrollmentRequestBodyMiddleware;
