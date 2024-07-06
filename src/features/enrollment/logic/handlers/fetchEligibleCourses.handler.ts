import { Request, Response } from "express";
import {
  CoursePrerequisiteModel,
  CourseType,
  SectionModel,
  SemesterCourseModel,
  SemesterModel,
  StudentModel,
} from "@fcai-sis/shared-models";

import { EnrollmentModel } from "@fcai-sis/shared-models";
import { TokenPayload } from "@fcai-sis/shared-middlewares";

type HandlerRequest = Request<
  {},
  {},
  {
    passedCourses: CourseType[];
    user: TokenPayload;
  }
>;

/**
 * Fetch all courses that a student is eligible to enroll in
 */
const fetchEligibleCourses = async (req: HandlerRequest, res: Response) => {
  const { userId } = req.body.user;

  const student = await StudentModel.findOne({ user: userId });

  if (!student)
    return res.status(404).json({
      errors: [
        {
          message: "Student not found",
        },
      ],
    });

  const { passedCourses } = req.body;

  // Find all enrollments with this student ID
  const enrollments = await EnrollmentModel.find({
    student: student._id,
  }).populate("course");

  // Find the latest semester
  const latestSemester = await SemesterModel.findOne(
    {},
    {},
    { sort: { startDate: -1 } }
  );

  if (!latestSemester)
    return res.status(404).json({
      errors: [
        {
          message: "No semester found",
        },
      ],
    });

  const coursesAvailableThisSemester = await SemesterCourseModel.find({
    semester: latestSemester._id,
  }).populate("course");

  const enrolledCourses = enrollments.filter(
    (enrollment) =>
      enrollment.status === "ENROLLED" || enrollment.status === "PASSED"
  );

  // Get available courses this semester that aren't already enrolled in nor passed (each enrollment has a course and its status is either passed, enrolled or failed)
  const coursesAvailableThisSemesterThatStudentHasNotEnrolledInOrPassed =
    coursesAvailableThisSemester.filter((semesterCourse) => {
      const enrolledCoursesIds = enrolledCourses.map((enrollment) =>
        enrollment.course._id.toString()
      );

      return !enrolledCoursesIds.includes(semesterCourse.course._id.toString());
    });

  // Get all courses that are available this semester and aren't already enrolled in nor passed and have prerequisites
  const coursesAvailableThisSemesterThatStudentHasNotEnrolledInOrPassedAndHavePrerequisites =
    await CoursePrerequisiteModel.find({
      course: {
        $in: coursesAvailableThisSemesterThatStudentHasNotEnrolledInOrPassed.map(
          (semesterCourse) => semesterCourse.course._id
        ),
      },
    }).populate("course");

  // Compare between the courses that are available this semester and have prerequisites and the courses that the student has passed
  const coursesAvailableThisSemesterThatStudentHasNotEnrolledInOrPassedAndHaveMetPrerequisites =
    coursesAvailableThisSemesterThatStudentHasNotEnrolledInOrPassedAndHavePrerequisites.filter(
      (coursePrerequisite) => {
        const passedCoursesIds = passedCourses.map((course: any) =>
          course._id.toString()
        );
        return passedCoursesIds.includes(
          coursePrerequisite.prerequisite._id.toString()
        );
      }
    );

  const coursesAvailableThisSemesterThatStudentHasNotEnrolledInOrPassedAndHaveNoPrerequisites =
    coursesAvailableThisSemesterThatStudentHasNotEnrolledInOrPassed.filter(
      (semesterCourse) =>
        !coursesAvailableThisSemesterThatStudentHasNotEnrolledInOrPassedAndHavePrerequisites
          .map((coursePrerequisite) => coursePrerequisite.course._id.toString())
          .includes(semesterCourse.course._id.toString())
    );

  const eligibleCourses = [
    ...coursesAvailableThisSemesterThatStudentHasNotEnrolledInOrPassedAndHaveMetPrerequisites,
    ...coursesAvailableThisSemesterThatStudentHasNotEnrolledInOrPassedAndHaveNoPrerequisites,
  ];

  const finalResponse = await Promise.all(
    eligibleCourses.map(async (course) => {
      const sections = await SectionModel.find({
        course: course.course._id,
      });

      return {
        course: course.course,
        sections,
      };
    })
  );
  const response = {
    courses: finalResponse,
  };

  return res.status(200).json(response);
};

export default fetchEligibleCourses;
