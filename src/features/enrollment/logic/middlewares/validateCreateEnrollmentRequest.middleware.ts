import * as validator from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { CourseModel, StudentModel } from '@fcai-sis/shared-models';

const validateCreateEnrollmentRequestMiddleware = [
  validator
    .body('studentId')
    .exists()
    .withMessage('Student ID is required')
    .isMongoId()
    .withMessage('Invalid student ID')
    .custom(async (value, { req }) => {
      // Fetch the student
      const student = await StudentModel.findById(value);

      if (!student) {
        throw new Error('Student not found');
      }

      req.context.student = student;

      return true;
    }),

  validator
    .body('coursesToEnrollIn')
    .exists()
    .withMessage('Courses to enroll in is required')
    .isArray()
    .withMessage('At least one course is required')
    .custom((_, { req }) => {
      req.context.coursesToEnrollIn = [];

      return true;
    }),

  validator
    .body('coursesToEnrollIn.*')
    .isMongoId()
    .withMessage('Invalid course ID')
    .custom(async (value, { req }) => {
      // Fetch the course
      const course = await CourseModel.findById(value);

      if (!course) {
        throw new Error('Course not found');
      }

      req.context.coursesToEnrollIn.push(course);

      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

export default validateCreateEnrollmentRequestMiddleware;
