import * as validator from "express-validator";
import {
  EnrollmentModel,
  InstructorTeachingModel,
  TaTeachingModel,
} from "@fcai-sis/shared-models";
import GraduationProjectTeamModel from "../../../graduation/data/models/graduationteam.model";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";

const middlewares = [
  validator
    .body("enrollments")
    .optional()
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

      if (!req.params) {
        throw new Error("Group ID is required");
      }

      const graduationGroup = await GraduationProjectTeamModel.findById(
        req.params.groupId
      );
      if (!graduationGroup) {
        throw new Error("Graduation group does not exist");
      }

      for (const enrollment of enrollments) {
        if (
          enrollment.semester._id.toString() !==
          graduationGroup.semester?.toString()
        ) {
          throw new Error("All enrollments must belong to the same semester");
        }
      }

      return true;
    }),

  validator
    .body("instructorTeachings")
    .optional()
    .isArray()
    .withMessage("Instructor teachings must be an array")
    .custom(async (value, { req }) => {
      // Check if the instructor teachings exist in the database
      const instructorTeachings = await InstructorTeachingModel.find({
        _id: { $in: value },
      }).populate("semester");
      if (instructorTeachings.length !== value.length) {
        throw new Error("Some instructor teachings do not exist");
      }

      if (!req.params) {
        throw new Error("Group ID is required");
      }

      const graduationGroup = await GraduationProjectTeamModel.findById(
        req.params.groupId
      );
      if (!graduationGroup) {
        throw new Error("Graduation group does not exist");
      }

      for (const teaching of instructorTeachings) {
        if (
          teaching.semester._id.toString() !==
          graduationGroup.semester?.toString()
        ) {
          throw new Error(
            "All Instructor Teachings must belong to the same semester"
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
      const taTeachings = await TaTeachingModel.find({
        _id: { $in: value },
      }).populate("semester");
      if (taTeachings.length !== value.length) {
        throw new Error("Some assistant teachings do not exist");
      }
      if (!req.params) {
        throw new Error("Group ID is required");
      }

      const graduationGroup = await GraduationProjectTeamModel.findById(
        req.params.groupId
      );
      if (!graduationGroup) {
        throw new Error("Graduation group does not exist");
      }

      for (const teaching of taTeachings) {
        if (
          teaching.semester._id.toString() !==
          graduationGroup.semester?.toString()
        ) {
          throw new Error("All TA Teachings must belong to the same semester");
        }
      }

      return true;
    }),

  validateRequestMiddleware,
];

const updateGraduationGroupRequestBodyMiddleware = middlewares;
export default updateGraduationGroupRequestBodyMiddleware;
