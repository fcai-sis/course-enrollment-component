import { Request, Response } from "express";
import { CourseEnrollmentModel } from "../../data/models/enrollment.model";
import { CourseModel } from "@fcai-sis/shared-models";

/**
 * Fetch all courses that a student is eligible to enroll in
 */

type HandlerRequest = Request<
  {},
  {},
  {
    studentId: string;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { studentId } = req.body;

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

  //Add logic to filter out courses that the student didn't pass the prerequisites for
  // const passedCourses = await CourseEnrollmentModel.find({student: studentId, status:"passed"}).populate("courses");
  // const courses = await CourseModel.find({});
  // const availableCourses = courses.filter((course) => {
  //   return !passedCourses.some((enrollment) => course._id === enrollment);
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
