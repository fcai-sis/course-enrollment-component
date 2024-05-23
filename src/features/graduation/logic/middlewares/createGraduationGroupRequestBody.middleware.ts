import {
  InstructorTeachingModel,
  SemesterModel,
  TaTeachingModel,
} from "@fcai-sis/shared-models";
import { Request, Response, NextFunction } from "express";
import * as validator from "express-validator";
import { EnrollmentModel } from "@fcai-sis/shared-models";
import GraduationProjectTeamModel from "features/graduation/data/models/graduationteam.model";

const middlewares = [
  validator
    .body("semester")
    .exists()
    .withMessage("Semester is required")
    .isMongoId()
    .withMessage("Semester must be a valid MongoDB ID")
    .custom(async (value) => {
      // Check if the semester exists in the database
      const semester = await SemesterModel.findById(value);
      if (!semester) {
        throw new Error("Semester does not exist");
      }
      return true;
    }),

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
    .custom((value, { req }) => {
      // Check if the enrollments belong to the semester value of the request body
      const semesterId = req.body.semester;
      for (const enrollment of value) {
        if (enrollment.semesterId.toString() !== semesterId) {
          throw new Error("All enrollments must belong to the same semester");
        }
      }
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
    .custom(async (value) => {
      // Check if the instructor teachings exist in the database
      const enrollments = await InstructorTeachingModel.find({
        _id: { $in: value },
      });
      if (enrollments.length !== value.length) {
        throw new Error("Some instructor teachings do not exist");
      }
      return true;
    })
    .custom((value, { req }) => {
      // Check if the instructor teachings belong to the semester value of the request body
      const semesterId = req.body.semester;
      for (const instructorTeaching of value) {
        if (instructorTeaching.semesterId.toString() !== semesterId) {
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
      const enrollments = await TaTeachingModel.find({
        _id: { $in: value },
      });
      if (enrollments.length !== value.length) {
        throw new Error("Some assistant teachings do not exist");
      }
      return true;
    })
    .custom((value, { req }) => {
      // Check if the assistant teachings belong to the semester value of the request body
      const semesterId = req.body.semester;
      for (const assistantTeaching of value) {
        if (assistantTeaching.semesterId.toString() !== semesterId) {
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

const createGraduationGroupRequestBodyMiddleware = middlewares;
export default createGraduationGroupRequestBodyMiddleware;
