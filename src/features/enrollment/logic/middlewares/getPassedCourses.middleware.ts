import { StudentModel } from "@fcai-sis/shared-models";
import { Request, Response, NextFunction } from "express";

import { EnrollmentModel } from "../../data/models/enrollment.model";

// Middleware chain
const getPassedCoursesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body.user;
  const student = await StudentModel.findOne({ userId });

  if (!student) return res.status(404).json({ message: "Student not found" });

  const studentId = student._id;
  const passedCourses: any = [];

  // Get all enrollments with this student ID that have the course status marked as "passed"
  const enrollments = await EnrollmentModel.find({
    studentId,
    status: "passed",
  });

  // Append the course ID to the passedCourses array
  enrollments.forEach((enrollment) => {
    passedCourses.push(enrollment.courseId);
  });

  // Add the passed courses to the request body
  req.body = {
    ...req.body,
    passedCourses,
  };

  next();
};

export default getPassedCoursesMiddleware;
