import { Request, Response } from "express";

type HandlerRequest = Request;

/**
 * Creates a new enrollment for a student in a course
 */
const createEnrollmentHandler = async (req: HandlerRequest, res: Response) => {
  const { enrollment, coursesToEnrollIn } = req.context;

  // Get the student's passed courses
  const passedCourses = enrollment.courses.filter(
    (course: any) => course.status === "passed"
  );

  // Check if the student is already enrolled in or has passed the courses
  for (const course of coursesToEnrollIn) {
    // Check if the course we want to enroll in is already in the enrolled courses
    const existingCourse = enrollment.courses.find((enrolledCourse: any) => {
      return enrolledCourse.courseId.toString() === course._id.toString();
    });

    // If the course does exist, and its status is either enrolled or passed (i.e. not failed), return an error
    if (existingCourse && existingCourse.status !== "failed") {
      return res.status(400).json({
        message: "You are already enrolled in or have passed this course",
        courseId: course._id,
      });
    }
  }

  // For each course to enroll in, check it's prerequisites in the `passedCourses` array
  for (const course of coursesToEnrollIn) {
    const prerequisitesIds = course.prerequisites;

    for (const prerequisiteId of prerequisitesIds) {
      const passedPrerequisite = passedCourses.find(
        (passedCourse: any) =>
          passedCourse.courseId.toString() === prerequisiteId.toString()
      );

      if (!passedPrerequisite) {
        return res.status(400).json({
          message: "One or more prerequisites are not passed",
          prerequisite: prerequisiteId,
        });
      }
    }
  }

  // Add the courses to the Enrollment
  for (const course of coursesToEnrollIn) {
    enrollment.courses.push({ courseId: course._id });
  }

  enrollment.markModified("courses");
  await enrollment.save();

  return res.status(201).json({ message: "Enrollment created successfully" });
};

export default createEnrollmentHandler;
