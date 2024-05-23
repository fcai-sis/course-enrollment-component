import { Request, Response } from "express";
import { ICourse, ISemester, IStudent } from "@fcai-sis/shared-models";

import { EnrollmentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    courseToEnrollIn: ICourse;
    studentId: IStudent;
    semesterId: ISemester;
  }
>;

/**
 * Creates an enrollment for a student in a course. Ignores prerequisites, and forces enrollment.
 */

const handler = async (req: HandlerRequest, res: Response) => {
  const { courseToEnrollIn, studentId, semesterId } = req.body;

  // Check if the course is already enrolled in
  const existingEnrollment = await EnrollmentModel.findOne({
    studentId,
    courseId: courseToEnrollIn._id,
    status: { $ne: "failed" },
  });
  if (existingEnrollment) {
    return res.status(400).json({
      message: "Course already enrolled in",
      course: courseToEnrollIn.code,
    });
  }
  // Create a new enrollment
  const newEnrollment = new EnrollmentModel({
    studentId,
    courseId: courseToEnrollIn._id,
    semesterId,
  });

  await newEnrollment.save();

  return res.status(200).json({
    message: "Enrollment created successfully",
  });
};

const adminCreateEnrollmentHandler = handler;
export default adminCreateEnrollmentHandler;
