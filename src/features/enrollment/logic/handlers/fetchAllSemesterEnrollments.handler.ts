import { Request, Response } from "express";
import { EnrollmentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  { courseId: string },
  {},
  { semesterId?: string }
>;

/**
 * Fetches all enrollments in a semester for a specific course
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { courseId } = req.params;
  let { semesterId } = req.body;

  // If semesterId is not provided, fetch the latest semesterId
  if (!semesterId) {
    const latestEnrollment = await EnrollmentModel.findOne({ courseId })
      .sort({ semesterId: -1 })
      .limit(1);

    if (latestEnrollment) {
      semesterId = latestEnrollment.semesterId;
    } else {
      return res.status(404).json({
        error: {
          message: "No enrollments found for this course in latest semester",
        },
      });
    }
  }

  const enrollments = await EnrollmentModel.find({
    semesterId: semesterId,
    courseId: courseId,
  });

  if (enrollments.length === 0) {
    return res.status(404).json({
      error: {
        message: "No enrollments found for this course in this semester",
      },
    });
  }

  const response = {
    enrollments,
  };

  return res.status(200).json(response);
};

const fetchAllSemesterEnrollmentsHandler = handler;
export default fetchAllSemesterEnrollmentsHandler;
