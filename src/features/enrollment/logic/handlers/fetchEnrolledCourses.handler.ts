import { Request, Response } from "express";
import { EnrollmentModel } from "../../data/models/enrollment.model";

/**
 * Fetches all courses that a student is enrolled in
 */

type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {}
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { studentId } = req.params;

  // Find all enrollments with this student ID
  const enrolledCourses = await EnrollmentModel.find({
    studentId,
  });

  const response = {
    studentId,
    // Return the enrolled courses (course code, status and seat number and exam hall)
    courses: enrolledCourses.map((enrollment) => {
      return {
        courseCode: enrollment.courseCode,
        status: enrollment.status,
        seatNumber: enrollment.seatNumber,
        examHall: enrollment.examHall,
      };
    }),
  };

  return res.status(200).json(response);
};

const fetchEnrolledCourses = handler;
export default fetchEnrolledCourses;
