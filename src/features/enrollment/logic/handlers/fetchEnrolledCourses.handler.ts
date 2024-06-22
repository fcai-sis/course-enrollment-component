import { Request, Response } from "express";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { StudentModel } from "@fcai-sis/shared-models";

import { EnrollmentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
  }
>;

/**
 * Fetches all courses that a student is enrolled in
 */
const fetchEnrolledCourses = async (req: HandlerRequest, res: Response) => {
  const { userId } = req.body.user;
  const student = await StudentModel.findOne({ user: userId });

  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  // Find all enrollments with this student ID
  const enrollments = await EnrollmentModel.find({
    student: student._id,
  }).populate({
    path: "course",
    select: "code creditHours -_id",
  });

  const response = {
    studentId: student.studentId,
    // Return the enrolled courses
    courses: enrollments.map((enrollment) => ({
      courseCode: enrollment.course.code,
      status: enrollment.status,
      seatNumber: enrollment.seatNumber,
      examHall: enrollment.examHall,
      creditHours: enrollment.course.creditHours,
    })),
  };

  return res.status(200).json(response);
};

export default fetchEnrolledCourses;
