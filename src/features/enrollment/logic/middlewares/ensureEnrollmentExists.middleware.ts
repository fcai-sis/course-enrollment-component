import { Request, Response, NextFunction } from 'express';

import { EnrollmentModel } from '../../../enrollment/data/models/enrollment.model';

type MiddlewareRequest = Request<{}, {}, { studentId: string }>;

const ensureEnrollmentExistsMiddleware = async (req: MiddlewareRequest, _: Response, next: NextFunction) => {
  const { studentId } = req.body;

  // Get the student's enrollment object if it exists
  const existingEnrollment = await EnrollmentModel.findOne({ studentId });

  // If the enrollment doesn't exist, create a new one
  // Otherwise, add the new courses to the existing enrollment
  if (!existingEnrollment) {
    req.context.enrollment = await EnrollmentModel.create({ studentId, courses: [] });
  } else {
    req.context.enrollment = existingEnrollment;
  }

  next();
}

export default ensureEnrollmentExistsMiddleware;
