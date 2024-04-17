import { Request, Response } from "express";
import { CourseModel } from "@fcai-sis/shared-models";

import { EnrollmentModel } from "../../data/models/enrollment.model";
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
  const { passedCourses } = req.body as FetchEligibleCoursesContextType;
  const studentId = req.params.studentId;

  // Find all enrollments with this student ID
  const enrollments = await EnrollmentModel.find({
    studentId,
  });

  // Find all courses that are available for enrollment
  const courses = await CourseModel.find({});
  let availableCourses;

  // If there's no enrollment, return all available courses
  if (!enrollments) {
    availableCourses = courses;
  } else {
    // If there are enrollments, remove courses that the student has already enrolled in (any enrollment with a status of "enrolled" or "passed")
    const enrolledCourses = enrollments.filter((enrollment) => {
      return enrollment.status === "enrolled" || enrollment.status === "passed";
    });

    availableCourses = courses.filter((course) => {
      return !enrolledCourses.some((enrollment) => {
        return enrollment.courseId === course._id;
      });
    });
  }

  // Using the passed courses array, if a prerequisite ID is not found in the passed courses array, remove the course from the available courses
  const filteredAvailableCourses = availableCourses.filter((course) => {
    return course.prerequisites.every((prerequisite) => {
      return passedCourses.includes(prerequisite.toString());
    });
  });

  const response = {
    studentId,
    // Return the enrolled courses (course code, status and seat number and exam hall)
    courses: enrollments.map((enrollment) => {
      return {
        courseCode: enrollment.courseCode,
        status: enrollment.status,
        seatNumber: enrollment.seatNumber,
        examHall: enrollment.examHall,
      };
    }),
    availableCourses: filteredAvailableCourses.map((course) => {
      return {
        code: course.code,
        name: course.name,
        description: course.description,
        prerequisites: course.prerequisites,
        department: course.department,
        creditHours: course.creditHours,
      };
    }),
  };

  return res.status(200).json(response);
};

export default fetchEligibleCourses;
