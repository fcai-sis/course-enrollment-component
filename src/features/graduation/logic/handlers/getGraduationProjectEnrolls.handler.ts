import { Request, Response } from "express";
import {
  CourseTypeEnum,
  EnrollmentModel,
  SemesterModel,
} from "@fcai-sis/shared-models";

/**
 * Gets all enrollments that have a graduation project as the course
 */
const handler = async (req: Request, res: Response) => {
  const latestSemester = await SemesterModel.findOne(
    {},
    {},
    { sort: { createdAt: -1 } }
  );

  if (!latestSemester) {
    return res.status(404).json({
      errors: [
        {
          message: "There are no semesters at the moment",
        },
      ],
    });
  }

  const enrollments = await EnrollmentModel.find({
    semester: latestSemester._id,
  })
    .populate("course")
    .populate("student");

  if (!enrollments) {
    return res.status(404).json({
      errors: [
        {
          message: "There are enrollments at the moment",
        },
      ],
    });
  }

  const filteredEnrollments = enrollments.filter(
    (enrollment) => enrollment.course.courseType === CourseTypeEnum[2]
  );

  if (!filteredEnrollments) {
    return res.status(404).json({
      errors: [
        {
          message: "There are no graduation project enrollments at the moment",
        },
      ],
    });
  }

  const response = {
    enrollments: filteredEnrollments,
  };

  return res.status(200).json(response);
};

const getAllGraduationProjectEnrollmentsHandler = handler;

export default getAllGraduationProjectEnrollmentsHandler;
