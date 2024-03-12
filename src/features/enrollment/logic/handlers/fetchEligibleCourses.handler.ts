import { Request, Response } from "express";
import { CourseEnrollmentModel } from "../../data/models/enrollment.model";
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

const handler = async (req: HandlerRequest, res: Response) => {
  const { passedCourses } = req.context as FetchEligibleCoursesContextType;
  const studentId = req.params.studentId;
  // console.log(passedCourses);

  const enrolledCourses = await CourseEnrollmentModel.find({
    student: studentId,
  }).populate("courses");

  if (!enrolledCourses || !enrolledCourses.length) {
    return res.status(404).json({ message: "No courses found" });
  }

  const courses = await CourseModel.find({});
  // TODO : filter out the courses that are already enrolled in by this user
  const availableCourses = courses.filter((course) => {
    return !enrolledCourses.some((enrollment) =>
      enrollment.courses.some(
        (enrolledCourse) => enrolledCourse._id === course._id
      )
    );
  });

  // Using the passed courses array, if a prerequisite ID is not found in the passed courses array, remove the course from the available courses
  // const filteredAvailableCourses = availableCourses.filter((course) => {
  //   if (course.prerequisites) {
  //     return course.prerequisites.every((prerequisite) =>
  //       passedCourses.includes(prerequisite)
  //     );
  //   }
  //   return true;
  // });

  const response = {
    studentId,
    courses: enrolledCourses.map((enrollment) => enrollment.courses),
    availableCourses: availableCourses,
  };

  return res.status(200).json(response);
};

const fetchEligibleCourses = handler;
export default fetchEligibleCourses;
