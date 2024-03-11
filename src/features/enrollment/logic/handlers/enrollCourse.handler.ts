import { Request, Response } from "express";
import { CourseEnrollmentModel } from "../../data/models/enrollment.model";
import { CourseModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {
    courseId: string;
    passedCourses?: any;
  }
>;

/**
 * Enrolls a student in a course, if they are eligible
 */

const handler = async (req: HandlerRequest, res: Response) => {
  const { courseId, passedCourses } = req.body;
  const studentId = req.params.studentId;
  console.log(passedCourses);

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

  if (enrollment) {
    return res.status(400).json({
      error: {
        message: "Student already enrolled in course",
      },
    });
  }

  if (course.prerequisites) {
    // check if the course prerequisites are in the passed courses array
    const passedPrerequisites = course.prerequisites.every(
      (prerequisite: any) =>
        passedCourses.data.some((enrollment: any) =>
          enrollment.some((course: any) => course._id === prerequisite)
        )
    );
    if (!passedPrerequisites) {
      return res.status(400).json({
        message:
          "Student has not passed the required prerequisites for this course",
      });
    }
  }

  const newEnrollment = await CourseEnrollmentModel.create({
    student: studentId,
    courses: [{ courseId, status: "enrolled" }],
  });

  const response = {
    studentId,
    courseId,
    status: "enrolled",
  };

  return res.status(200).json(response);
};

const enrollCourseHandler = handler;
export default enrollCourseHandler;
