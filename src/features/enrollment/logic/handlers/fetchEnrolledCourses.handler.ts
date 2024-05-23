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
const handler = async (req: HandlerRequest, res: Response) => {
  const { userId } = req.body.user;
  const student = await StudentModel.findOne({ userId });

  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  const studentId = student?._id;

  // Find all enrollments with this student ID
  const enrolledCourses = await EnrollmentModel.find(
    { studentId },
    {
      __v: 0,
      _id: 0,
      studentId: 0,
    }
  ).populate({
    path: "courseId",
    select: "code -_id",
  });

  const response = {
    studentId,
    // Return the enrolled courses (course code, status and seat number and exam hall)
    courses: enrolledCourses,
  };

  return res.status(200).json(response);
};

const fetchEnrolledCourses = handler;
export default fetchEnrolledCourses;
