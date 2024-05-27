import { Request, Response } from "express";
import { ICourse, ISemester, IStudent } from "@fcai-sis/shared-models";

import { EnrollmentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    courseId: ICourse;
    studentId: IStudent;
    semesterId: ISemester;
  }
>;

/**
 * Creates an enrollment for a student in a course. Ignores prerequisites, and forces enrollment.
 */

const handler = async (req: HandlerRequest, res: Response) => {
  const { courseId, studentId, semesterId } = req.body;

  // Check if the course is already enrolled in
  const existingEnrollment = await EnrollmentModel.findOne({
    studentId,
    courseId: courseId,
    status: { $ne: "failed" },
  });
  if (existingEnrollment) {
    return res.status(400).json({
      message: "Course already enrolled in",
      course: courseId.code,
    });
  }
  // Create a new enrollment
  const newEnrollment = new EnrollmentModel({
    studentId,
    courseId: courseId,
    semesterId,
  });

  await newEnrollment.save();

  return res.status(200).json({
    message: "Enrollment created successfully",
  });
};

const adminCreateEnrollmentHandler = handler;
export default adminCreateEnrollmentHandler;
