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
  const { skip, limit } = req.query;
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
    .populate("examHall")
    .populate("student")
    .sort({ "student.studentId": "asc" })
    .skip(Number(skip ?? 0))
    .limit(limit as unknown as number);

  console.log("skip", skip);
  console.log("limit", limit);

  if (enrollments.length === 0) {
    return res.status(404).json({
      errors: [
        {
          message: "No enrollments found for this course in this semester",
        },
      ],
    });
  }

  const totalEnrollments = await EnrollmentModel.countDocuments({
    semester: semesterId,
    course,
  });

  const response = {
    enrollments,
    totalEnrollments,
  };

  return res.status(200).json(response);
};

const fetchAllSemesterEnrollmentsHandler = handler;
export default fetchAllSemesterEnrollmentsHandler;
