import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";
import { EnrollmentModel } from "features/enrollment/data/models/enrollment.model";
import GraduationProjectTeamModel from "features/graduation/data/models/gpt.model";

const middlewares = [
  validator
    .body("enrollments")
    .optional()
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
    .custom(async (value) => {
      // Check if the enrollments exist in the database
      const enrollments = await EnrollmentModel.find({
        _id: { $in: value },
      });
      if (enrollments.length !== value.length) {
        throw new Error("Some enrollments do not exist");
      }
      return true;
    })
    .custom(async (value, { req }) => {
      // Check if the enrollments have the same semester by using the groupId passed in the params
      if (!req.params) {
        throw new Error("Group ID is required");
      }
      const graduationGroup = await GraduationProjectTeamModel.findOne({
        groupId: req.params.groupId,
      });
      if (!graduationGroup) {
        throw new Error("Graduation group does not exist");
      }

      for (const enrollment of value) {
        if (
          enrollment.semester.toString() !==
          graduationGroup.semester?.toString()
        ) {
          throw new Error("All enrollments must belong to the same semester");
        }
      }
    }),

  validator
    .body("instructorTeachings")
    .optional()
    .withMessage("Instructor teachings are required")
    .isArray()
    .withMessage("Instructor teachings must be an array")
    .custom(async (value) => {
      // Check if the instructor teachings exist in the database
      const enrollments = await EnrollmentModel.find({
        _id: { $in: value },
      });
      if (enrollments.length !== value.length) {
        throw new Error("Some instructor teachings do not exist");
      }
      return true;
    })
    .custom(async (value, { req }) => {
      // Check if the instructor teachings have the same semester by using the groupId passed in the params
      if (!req.params) {
        throw new Error("Group ID is required");
      }
      const graduationGroup = await GraduationProjectTeamModel.findOne({
        groupId: req.params.groupId,
      });
      if (!graduationGroup) {
        throw new Error("Graduation group does not exist");
      }

      for (const instructorTeaching of value) {
        if (
          instructorTeaching.semester.toString() !==
          graduationGroup.semester?.toString()
        ) {
          throw new Error(
            "All instructor teachings must belong to the same semester"
          );
        }
      }
    }),

  validator
    .body("assistantTeachings")
    .exists()
    .withMessage("Assistant teachings are required")
    .isArray()
    .withMessage("Assistant teachings must be an array")
    .custom(async (value) => {
      // Check if the assistant teachings exist in the database
      const enrollments = await EnrollmentModel.find({
        _id: { $in: value },
      });
      if (enrollments.length !== value.length) {
        throw new Error("Some assistant teachings do not exist");
      }
      return true;
    })
    .custom(async (value, { req }) => {
      // Check if the assistant teachings have the same semester by using the groupId passed in the params
      if (!req.params) {
        throw new Error("Group ID is required");
      }
      const graduationGroup = await GraduationProjectTeamModel.findOne({
        groupId: req.params.groupId,
      });
      if (!graduationGroup) {
        throw new Error("Graduation group does not exist");
      }

      for (const assistantTeaching of value) {
        if (
          assistantTeaching.semester.toString() !==
          graduationGroup.semester?.toString()
        ) {
          throw new Error(
            "All assistant teachings must belong to the same semester"
          );
        }
      }
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    req.body.groupCode = req.body.groupCode.trim();

    next();
  },
];

const updateGraduationGroupRequestBodyMiddleware = middlewares;
export default updateGraduationGroupRequestBodyMiddleware;
