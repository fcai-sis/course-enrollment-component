import { Document } from "mongoose";
import { StudentModel } from "@fcai-sis/shared-models";
import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "@fcai-sis/shared-middlewares";

import { EnrollmentModel, EnrollmentType } from "../../data/models/enrollment.model";

type MiddlewareRequest = Request<
  {},
  {},
  {
    user: TokenPayload,
    enrollments: (EnrollmentType & Document)[];
  }
>;

const validateEnrollmentMiddleware = async (
  req: MiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body.user;
  const student = await StudentModel.findOne({ userId });

  if (!student) return res.status(404).json({ message: "Student not found" });

  // Get all enrollments with this student ID
  const existingEnrollments = await EnrollmentModel.find({
    studentId: student._id
  });

  // If the enrollment doesn't exist, create a new one
  // Otherwise, add the new course to the existing enrollment
  if (existingEnrollments.length === 0) {
    req.body.enrollments = [];
  } else {
    req.body.enrollments = existingEnrollments;
  }

  next();
};

export default validateEnrollmentMiddleware;
