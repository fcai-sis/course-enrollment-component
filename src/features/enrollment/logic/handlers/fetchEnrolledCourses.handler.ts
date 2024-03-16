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

  const enrolledCourses = await EnrollmentModel.find({
    studentId: studentId,
  }).populate("courses");
  if (!enrolledCourses || !enrolledCourses.length) {
    return res.status(404).json({ message: "No courses found" });
  }

  const response = {
    studentId,
    courses: enrolledCourses.map((enrollment) => enrollment.courses),
  };

  return res.status(200).json(response);
};

const fetchEnrolledCourses = handler;
export default fetchEnrolledCourses;
