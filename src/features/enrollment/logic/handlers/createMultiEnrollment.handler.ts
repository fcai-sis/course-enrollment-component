import { Request, Response } from "express";
import { ICourse, ISemester, IStudent } from "@fcai-sis/shared-models";
import { EnrollmentModel, IEnrollment } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    enrollments: IEnrollment[];
    coursesToEnrollIn: ICourse[];
    student: IStudent;
    semesterId: ISemester;
  }
>;

/**
 * Creates multiple enrollments for a student in multiple courses (same logic as createEnrollment.handler.ts but uses a for loop to create multiple enrollments)
 */

const createMultiEnrollmentHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { enrollments, coursesToEnrollIn, student, semesterId } = req.body;

  // Get the student's passed courses
  const passedCourses = enrollments
    .filter((enrollment) => enrollment.status === "passed")
    .map((enrollment) => enrollment.courseId);

  // Check if the courseToEnrollIn is already in the enrollments array
  for (const courseToEnrollIn of coursesToEnrollIn) {
    for (const enrollment of enrollments) {
      // If the course does exist, and its status is either enrolled or passed (i.e. not failed), return an error
      if (
        enrollment.courseId.toString() === courseToEnrollIn._id?.toString() && // TODO: why do i need to use ? here
        enrollment.status !== "failed"
      ) {
        return res.status(400).json({
          message: "Course already enrolled in",
          course: courseToEnrollIn.code,
        });
      }
    }
  }

  // Check if the student has passed all prerequisites for the course
  for (const courseToEnrollIn of coursesToEnrollIn) {
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
  }

  // Create a new enrollment
  for (const courseToEnrollIn of coursesToEnrollIn) {
    const newEnrollment = new EnrollmentModel({
      studentId: student,
      courseId: courseToEnrollIn._id,
      semesterId: semesterId,
    });

    await newEnrollment.save();
  }

  return res.status(201).json({
    message: "Enrollments created successfully",
  });
};

export default createMultiEnrollmentHandler;
