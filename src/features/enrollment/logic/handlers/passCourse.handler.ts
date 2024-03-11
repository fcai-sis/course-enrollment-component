import { Request, Response } from "express";
import { CourseEnrollmentModel } from "../../data/models/enrollment.model";
import { CourseModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    studentId: string;
    courseId: string;
  }
>;

/**
 * Mark a student's status as passed for a course they are enrolled in
 */

const handler = async (req: HandlerRequest, res: Response) => {
  const { studentId, courseId } = req.body;

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return res.status(404).json({
      error: {
        message: "Course not found",
      },
    });
  }

  const enrollment = await CourseEnrollmentModel.findOne({
    student: studentId,
    "courses.courseId": courseId,
  });

  if (!enrollment) {
    return res.status(400).json({
      error: {
        message: "Student not enrolled in course",
      },
    });
  }

  // set the status to pass for the course
  enrollment.courses.forEach((course: any) => {
    if (course.courseId == courseId) {
      course.status = "passed";
    }
  });

  await enrollment.save();

  return res.status(200).json(enrollment);
};

const coursePassedHandler = handler;
export default coursePassedHandler;
