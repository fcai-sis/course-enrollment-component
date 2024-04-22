import { Request, Response } from "express";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { StudentModel } from "@fcai-sis/shared-models";

import { EnrollmentModel } from "../../data/models/enrollment.model";


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

  const studentId = student?.studentId;

  // Find all enrollments with this student ID
  const enrolledCourses = await EnrollmentModel.find({ studentId }).populate("courseId");

  const response = {
    studentId,
    // Return the enrolled courses (course code, status and seat number and exam hall)
    courses: enrolledCourses
  };

  return res.status(200).json(response);
};

const fetchEnrolledCourses = handler;
export default fetchEnrolledCourses;
