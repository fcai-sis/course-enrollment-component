import { CourseModel, StudentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { CourseEnrollmentModel } from "../../data/models/enrollment.model";

/**
 * Creates a new enrollment for a student in a course
 */

type HandlerRequest = Request<
  {},
  {},
  {
    studentId: string;
    courseIds: string[];
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { studentId, courseIds } = req.body;

  // Fetch the student
  const student = await StudentModel.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const courses = await CourseModel.find({ _id: { $in: courseIds } });

  // Check if all courses exist
  if (courses.length !== courseIds.length) {
    return res.status(404).json({ message: "Course not found" });
  }
  // Create course enrollment
  const enrollmentCourses = courses.map((course) => ({
    courseId: course._id,
    status: "enrolled",
    seatNumber: 0,
    finalExamHall: null,
  }));

  // Add the course to the student's enrolled courses
  const enrollment = await CourseEnrollmentModel.create({
    student: studentId,
    courses: enrollmentCourses,
  });

  return res.status(200).json(enrollment);
};

const createEnrollment = handler;
export default createEnrollment;
