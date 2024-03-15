import { Document } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { CourseType, StudentType } from '@fcai-sis/shared-models';

import { EnrollmentModel, EnrollmentType } from '../../../enrollment/data/models/enrollment.model';

type MiddlewareRequest = Request<{}, {}, {
  studentId: string;
  enrollment: EnrollmentType & Document;
  coursesToEnrollIn: (CourseType & Document)[];
  student: StudentType & Document;
}>;

const ensureEnrollmentExistsMiddleware = async (req: MiddlewareRequest, _: Response, next: NextFunction) => {
  const { studentId } = req.body;

  // Get the student's enrollment object if it exists
  const existingEnrollment = await EnrollmentModel.findOne({ studentId });

  // If the enrollment doesn't exist, create a new one
  // Otherwise, add the new courses to the existing enrollment
  if (!existingEnrollment) {
    req.body.enrollment = await EnrollmentModel.create({ studentId, courses: [] });
  } else {
    req.body.enrollment = existingEnrollment;
  }

  next();
}

export default ensureEnrollmentExistsMiddleware;
