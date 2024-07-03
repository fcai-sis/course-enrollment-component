import { Request, Response } from "express";
import {
  CourseModel,
  EnrollmentModel,
  SemesterModel,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  { courseCode: string },
  {},
  { semesterId?: string }
>;

/**
 * Fetches all enrollments in a semester for a specific course
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { courseCode } = req.params;
  let { semesterId } = req.body;

  // If semesterId is not provided, fetch the latest semesterId
  if (!semesterId) {
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

    semesterId = latestSemester._id;
  }

  const course = await CourseModel.findOne({
    code: courseCode,
  });

  if (!course) {
    return res.status(404).json({
      errors: [
        {
          message: "Course not found",
        },
      ],
    });
  }

  const enrollments = await EnrollmentModel.find({
    semester: semesterId,
    course,
  })
    .populate("student")
    .sort({ "student.studentId": "asc" });

  if (enrollments.length === 0) {
    return res.status(404).json({
      errors: [
        {
          message: "No enrollments found for this course in this semester",
        },
      ],
    });
  }

  const response = {
    enrollments,
  };

  return res.status(200).json(response);
};

const fetchAllSemesterEnrollmentsHandler = handler;
export default fetchAllSemesterEnrollmentsHandler;
