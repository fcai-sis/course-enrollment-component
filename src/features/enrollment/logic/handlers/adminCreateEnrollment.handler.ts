import { Request, Response } from "express";
import { CourseType } from "@fcai-sis/shared-models";

import { EnrollmentModel } from "../../data/models/enrollment.model";
import { Document } from "mongoose";

// TODO : Refactor to include authorization later
type HandlerRequest = Request<
  {},
  {},
  {
    coursesToEnrollIn: (CourseType & Document)[];
    studentId: string;
  }
>;

/**
 * Creates an enrollment for a student in a course(s). Ignores prerequisites, and forces enrollment.
 */

const handler = async (req: HandlerRequest, res: Response) => {
  const { coursesToEnrollIn, studentId } = req.body;

  const enrollment = await EnrollmentModel.findOne({ studentId });
  if (!enrollment) {
    return res.status(404).json({
      message: "Enrollment not found",
    });
  }

  for (const course of coursesToEnrollIn) {
    const existingCourse = enrollment.courses.find((enrolledCourse: any) => {
      return enrolledCourse.courseId.toString() === course._id.toString();
    });

    if (existingCourse && existingCourse.status !== "failed") {
      return res.status(400).json({
        message: "You are already enrolled in or have passed this course",
        courseCode: course.code,
      });
    }
  }

  for (const course of coursesToEnrollIn) {
    enrollment.courses.push({
      courseId: course._id,
      courseCode: course.code,
      status: "enrolled",
    });
  }
  await enrollment.save();

  return res.status(200).json({
    message: "Enrollment created successfully",
  });
};

const adminCreateEnrollmentHandler = handler;
export default adminCreateEnrollmentHandler;
