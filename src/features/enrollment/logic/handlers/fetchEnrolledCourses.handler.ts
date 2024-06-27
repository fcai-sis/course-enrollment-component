import { Request, Response } from "express";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { StudentModel } from "@fcai-sis/shared-models";

import { EnrollmentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
  },
  {
    limit?: number;
    skip?: number;
  }
>;

/**
 * Fetches all courses that a student is enrolled in
 */
const fetchEnrolledCourses = async (req: HandlerRequest, res: Response) => {
  const { userId } = req.body.user;
  const { limit, skip } = req.query;
  const student = await StudentModel.findOne({ user: userId });

  if (!student) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }

  // Find all enrollments with this student ID
  const enrollments = await EnrollmentModel.find(
    {
      student: student._id,
    },
    {},
    {
      skip,
      limit,
    }
  )
    .populate({
      path: "course",
      select: "code creditHours name -_id",
    })
    .populate({
      path: "examHall",
      select: "name -_id",
    });

  const totalStudentEnrollments = await EnrollmentModel.countDocuments({
    student: student._id,
  });

  const passedEnrollments = enrollments.filter(
    (enrollment) => enrollment.status === "PASSED"
  );

  const response = {
    // Return the enrolled courses
    courses: enrollments,
    totalStudentEnrollments,
    passedCourses: passedEnrollments,
  };

  return res.status(200).json(response);
};

export default fetchEnrolledCourses;
