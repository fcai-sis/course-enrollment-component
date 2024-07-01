import {
  InstructorTeachingModel,
  SemesterModel,
  TaTeachingModel,
} from "@fcai-sis/shared-models";
import * as validator from "express-validator";
import { EnrollmentModel } from "@fcai-sis/shared-models";
import GraduationProjectTeamModel from "../../../graduation/data/models/graduationteam.model";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

const middlewares = [
  validator
    .body("semester")
    .exists()
    .withMessage("Semester is required")
    .isMongoId()
    .withMessage("Semester must be a valid MongoDB ID"),

  validator
    .body("enrollments")
    .exists()
    .withMessage("Enrollments are required")
    .isArray()
    .withMessage("Enrollments must be an array")
    .custom((value) => {
      // Check if the enrollments are unique
      const uniqueEnrollments = new Set(value);
      if (uniqueEnrollments.size !== value.length) {
        throw new Error("Enrollments must be unique");
      }
      return true;
    })
    .custom(async (value, { req }) => {
      // Check if the enrollments exist in the database
      const enrollments = await EnrollmentModel.find({
        _id: { $in: value },
      }).populate("semester");
      if (enrollments.length !== value.length) {
        throw new Error("Some enrollments do not exist");
      }

      // Check if the enrollments belong to the semester value of the request body
      const semesterId = req.body.semester;

      for (const enrollment of enrollments) {
        if (enrollment.semester._id.toString() !== semesterId.toString()) {
          throw new Error("All enrollments must belong to the same semester");
        }
      }

      return true;
    })
    .custom(async (value) => {
      // Check if the enrollments are not already in a graduation project group
      const graduationProject = await GraduationProjectTeamModel.findOne({
        enrollments: { $in: value },
      });

      if (graduationProject) {
        throw new Error(
          "Some enrollments are already in a graduation project group"
        );
      }
      return true;
    }),

  validator
    .body("instructorTeachings")
    .exists()
    .withMessage("Instructor teachings are required")
    .isArray()
    .withMessage("Instructor teachings must be an array")
    .custom(async (value, { req }) => {
      // Check if the instructor teachings exist in the database
      const enrollments = await InstructorTeachingModel.find({
        _id: { $in: value },
      }).populate("semester");
      if (enrollments.length !== value.length) {
        throw new Error("Some instructor teachings do not exist");
      }

      const semesterId = req.body.semester;

      for (const instructorTeaching of enrollments) {
        if (
          instructorTeaching.semester._id.toString() !== semesterId.toString()
        ) {
          throw new Error(
            "All instructor teachings must belong to the same semester"
          );
        }
      }

      return true;
    }),

  validator
    .body("assistantTeachings")
    .exists()
    .withMessage("Assistant teachings are required")
    .isArray()
    .withMessage("Assistant teachings must be an array")
    .custom(async (value, { req }) => {
      // Check if the assistant teachings exist in the database
      const enrollments = await TaTeachingModel.find({
        _id: { $in: value },
      }).populate("semester");
      if (enrollments.length !== value.length) {
        throw new Error("Some assistant teachings do not exist");
      }

      const semesterId = req.body.semester;

      for (const assistantTeaching of enrollments) {
        if (
          assistantTeaching.semester._id.toString() !== semesterId.toString()
        ) {
          throw new Error(
            "All assistant teachings must belong to the same semester"
          );
        }
      }

      return true;
    }),

  validateRequestMiddleware,
];

const createGraduationGroupRequestBodyMiddleware = middlewares;
export default createGraduationGroupRequestBodyMiddleware;
