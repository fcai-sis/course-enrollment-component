import { Document } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { CourseType, StudentType } from "@fcai-sis/shared-models";

import {
  EnrollmentModel,
  EnrollmentType,
} from "../../data/models/enrollment.model";

type MiddlewareRequest = Request<
  {},
  {},
  {
    studentId: string;
    enrollments: (EnrollmentType & Document)[];
    courseToEnrollIn: CourseType & Document;
    student: StudentType & Document;
  }
>;

// TODO: revise this with youssef gala

const validateEnrollmentMiddleware = async (
  req: MiddlewareRequest,
  _: Response,
  next: NextFunction
) => {
  const { studentId } = req.body;

  // Get all enrollments with this student ID
  const existingEnrollments = await EnrollmentModel.find({
    studentId,
  })

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
