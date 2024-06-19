import { Request, Response } from "express";

import { EnrollmentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {
    semesterId: string;
  },
  {},
  {}
>;

/**
 * Fetches all enrollments in a semester
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { semesterId } = req.params;
  const enrollments = await EnrollmentModel.find({ semesterId });

  if (!enrollments) {
    return res.status(404).json({
      error: {
        message: "No enrollments found",
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
