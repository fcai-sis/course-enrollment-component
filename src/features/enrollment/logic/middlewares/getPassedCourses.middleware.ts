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

  const studentsEnrollments = await EnrollmentModel.find({
    student: student._id,
  }).populate("course");

  if (!studentsEnrollments)
    return res.status(500).json({
      error: {
        message: "An error occurred while fetching student enrollments",
      },
    });

  const passedCourses = studentsEnrollments
    .filter((enrollment) => enrollment.status === EnrollmentStatusEnum[1])
    .map((enrollment) => enrollment.course);

  // Add the passed courses to the request body
  req.body = {
    ...req.body,
    passedCourses,
  };

  next();
};

export default getPassedCoursesMiddleware;
