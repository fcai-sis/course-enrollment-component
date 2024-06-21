import { EnrollmentStatusEnum, StudentModel } from "@fcai-sis/shared-models";
import { Request, Response, NextFunction } from "express";

import { EnrollmentModel } from "@fcai-sis/shared-models";

// Middleware chain
const getPassedCoursesMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body.user;
  const student = await StudentModel.findOne({ user: userId });

  if (!student)
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });

  const studentId = student._id;
  const passedCourses: any = [];

  // Get all enrollments with this student ID that have the course status marked as "passed"
  const enrollments = await EnrollmentModel.find({
    student: studentId,
    status: EnrollmentStatusEnum[1],
  }).populate("course");

  // Append the course ID to the passedCourses array
  // enrollments.forEach((enrollment) => {
  //   passedCourses.push(enrollment.courseId);
  // });

  // Add the passed courses to the request body
  req.body = {
    ...req.body,
    passedCourses: enrollments.map((enrollment) => enrollment.course),
  };

  next();
};

export default getPassedCoursesMiddleware;
