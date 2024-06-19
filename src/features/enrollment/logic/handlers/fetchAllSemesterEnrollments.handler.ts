import { Request, Response } from "express";

import { EnrollmentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    semesterId: string;
    courseId: string;
  }
>;

/**
 * Fetches all enrollments in a semester for a specific course
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { semesterId, courseId } = req.body;
  const enrollments = await EnrollmentModel.find({
    semester: semesterId,
    course: courseId,
  });

  if (!enrollments) {
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
