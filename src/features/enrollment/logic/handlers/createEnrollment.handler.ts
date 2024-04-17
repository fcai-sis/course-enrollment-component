import { Request, Response } from "express";
import { CourseType } from "@fcai-sis/shared-models";

import {
  EnrollmentType,
  EnrollmentModel,
} from "../../data/models/enrollment.model";
import { Document } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    enrollments: (EnrollmentType & Document)[];
    courseToEnrollIn: CourseType & Document;
    studentId: string;
  }
>;

/**
 * Creates a new enrollment for a student in a course
 */
const createEnrollmentHandler = async (req: HandlerRequest, res: Response) => {
  const { enrollments, courseToEnrollIn, studentId } = req.body;

  // Get the student's passed courses
  const passedCourses = enrollments
    .filter((enrollment) => enrollment.status === "passed")
    .map((enrollment) => enrollment.courseId);

  // Check if the courseToEnrollIn is already in the enrollments array
  for (const enrollment of enrollments) {
    // If the course does exist, and its status is either enrolled or passed (i.e. not failed), return an error
    if (
      enrollment.courseId.toString() === courseToEnrollIn._id.toString() &&
      enrollment.status !== "failed"
    ) {
      return res.status(400).json({
        message: "Course already enrolled in",
        course: courseToEnrollIn.code,
      });
    }
  }

  console.log("course to enroll in", courseToEnrollIn);

  // Check if the student has passed all prerequisites for the course
  const prerequisites = courseToEnrollIn.prerequisites;

  // TESTER : IF THIS FAILS CHANGE TO toString()
  for (const prerequisite of prerequisites) {
    if (!passedCourses.includes(prerequisite)) {
      return res.status(400).json({
        message: "Prerequisite not met",
        prerequisite,
      });
    }
  }

  // Create a new enrollment
  const newEnrollment = new EnrollmentModel({
    studentId: studentId,
    courseId: courseToEnrollIn._id,
    courseCode: courseToEnrollIn.code,
  });

  await newEnrollment.save();

  return res.status(201).json({
    message: "Enrollment created successfully",
    enrollment: newEnrollment,
  });
};

export default createEnrollmentHandler;
