import { Request, Response } from "express";
import { EnrollmentModel } from "../../data/models/enrollment.model";
import { CourseModel } from "@fcai-sis/shared-models";
import { FetchEligibleCoursesContextType } from "../contexts/fetchEligibleCourses.context";

/**
 * Fetch all courses that a student is eligible to enroll in
 */

type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {}
>;

const fetchEligibleCourses = async (req: HandlerRequest, res: Response) => {
  const { passedCourses } = req.context as FetchEligibleCoursesContextType;
  const studentId = req.params.studentId;

  const enrolledCourses = await EnrollmentModel.find({
    studentId: studentId,
  }).populate("courses");

  const courses = await CourseModel.find({});
  let availableCourses;
  if (!enrolledCourses || !enrolledCourses.length) {
    console.log("No enrolled courses found");

    availableCourses = courses;
  } else {
    // Filter out the courses that are already enrolled in by this user
    availableCourses = courses.filter((course) => {
      return !enrolledCourses.some((enrollment) => {
        return enrollment.courses.some(
          (enrolledCourse: any) =>
            enrolledCourse.courseId.toString() === course._id.toString()
        );
      });
    });
  }

  // Using the passed courses array, if a prerequisite ID is not found in the passed courses array, remove the course from the available courses
  const filteredAvailableCourses = availableCourses.filter((course) => {
    return course.prerequisites.every((prerequisiteId) => {
      return passedCourses.some(
        (passedCourse: any) =>
          passedCourse.courseId.toString() === prerequisiteId.toString()
      );
    });
  });

  const response = {
    studentId,
    courses: enrolledCourses.map((enrollment) => enrollment.courses),
    availableCourses: filteredAvailableCourses,
  };

  return res.status(200).json(response);
};

export default fetchEligibleCourses;
