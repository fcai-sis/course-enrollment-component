import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import { CourseModel, ICourse, SemesterModel } from "@fcai-sis/shared-models";
import logger from "../../../../core/logger";

/*
 * Middleware to validate the request body for creating multiple enrollments
 *
 * Attaches the student and courses to enroll in to the request body
 **/
const validateCreateMultiEnrollmentRequestMiddleware = [
  validator
    .body("courseCodes")
    .exists()
    .withMessage("Course codes are required")
    .isArray({ min: 2 })
    .withMessage("Must be an array of at least 2 course codes")
    .custom(async (value, { req }) => {
      // Ensure all courses exist
      const courses = await CourseModel.find({ code: { $in: value } });

      const invalidCourses = value.filter(
        (courseCode: string) =>
          !courses.find((course: ICourse) => course.code === courseCode)
      );

      if (invalidCourses.length > 0) {
        throw new Error(`Invalid course codes: ${invalidCourses.join(", ")}`);
      }

      req.body.coursesToEnrollIn = courses;
      return true;
    }),

  validator
    .body("semesterId")
    .exists()
    .withMessage("Semester ID is required")
    .isMongoId()
    .withMessage("Invalid semester ID")
    .custom(async (value, { req }) => {
      // Ensure semester exists
      const semester = await SemesterModel.findById(value);

      if (!semester) throw new Error("Semester not found");

      // Check if all courses are offered in this semester
      const courses = req.body.coursesToEnrollIn;
      const notOfferedCourses = courses.filter(
        (course: ICourse) => !semester.courseIds.includes(course._id)
      );
      if (notOfferedCourses.length > 0) {
        throw new Error(
          `Courses not offered in this semester: ${notOfferedCourses
            .map((course: ICourse) => course.code)
            .join(", ")}`
        );
      }

      req.body.semesterId = semester;

      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating create multiple enrollment req body: ${JSON.stringify(
        req.body
      )}`
    );
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for create multiple enrollment req body: ${JSON.stringify(
          req.body
        )}`
      );

      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    next();
  },
];

export default validateCreateMultiEnrollmentRequestMiddleware;
