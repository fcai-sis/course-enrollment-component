import { Request, Response } from "express";
import { CourseEnrollmentModel } from "../../data/models/enrollment.model";

/**
 * Fetches all courses that a student is enrolled in
 */

type HandlerRequest = Request<
  {},
  {},
  {
    studentId: string;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { studentId } = req.body;

  const enrolledCourses = await CourseEnrollmentModel.find({
    student: studentId,
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
