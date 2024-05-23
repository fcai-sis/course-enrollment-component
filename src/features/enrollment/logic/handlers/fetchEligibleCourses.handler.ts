import { Request, Response } from "express";
import { CourseModel, StudentModel } from "@fcai-sis/shared-models";

import { EnrollmentModel } from "@fcai-sis/shared-models";
import { FetchEligibleCoursesContextType } from "../contexts/fetchEligibleCourses.context";

/**
 * Fetch all courses that a student is eligible to enroll in
 */
const fetchEligibleCourses = async (req: Request, res: Response) => {
  const { userId } = req.body.user;
  const student = await StudentModel.findOne({ userId });

  if (!student) return res.status(404).json({ message: "Student not found" });

  const studentId = student._id;
  const { passedCourses } = req.body as FetchEligibleCoursesContextType;

  // Find all enrollments with this student ID
  const enrollments = await EnrollmentModel.find({ studentId });

  // Find all courses that are available for enrollment
  const courses = await CourseModel.find({});

  let availableCourses;

  // If there's no enrollment, return all available courses
  if (enrollments.length === 0) {
    availableCourses = courses;
  } else {
    // If there are enrollments, get courses that the student has already enrolled in (any enrollment with a status of "enrolled" or "passed")
    const enrolledCourses = enrollments.filter((enrollment) => {
      return enrollment.status === "enrolled" || enrollment.status === "passed";
    });
    // remove courses that the student has already enrolled in from the available courses
    availableCourses = courses.filter(
      (course) =>
        !enrolledCourses.some(
          (enrollment) =>
            enrollment.courseId.toString() === course._id.toString()
        )
    );
  }

  // Using the passed courses array, if a prerequisite ID is not found in the passed courses array, remove the course from the available courses
  const filteredAvailableCourses = availableCourses.filter((course) =>
    course.prerequisites.every((prerequisite: any) => {
      console.log("PREREUISITES", prerequisite);
      console.log("PASSED COURSES", passedCourses);
      console.log(
        "PASSED COURSES INCLUDES",
        passedCourses
          .map((id) => id.toString())
          .includes(prerequisite.toString())
      );

      return passedCourses
        .map((id) => id.toString())
        .includes(prerequisite.toString());
    })
  );


  const response = {
    studentId,
    // Return the enrolled courses (course code, status and seat number and exam hall)
    courses: enrollments.map((enrollment) => {
      return {
        courseCode: enrollment.courseId,
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
        departments: course.departments,
        creditHours: course.creditHours,
      };
    }),
  };

  return res.status(200).json(response);
};

export default fetchEligibleCourses;
