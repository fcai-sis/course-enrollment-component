import { Request, Response } from "express";
import { ISemester, SemesterModel } from "@fcai-sis/shared-models";
import { EnrollmentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    semesterId: ISemester;
  }
>;

/**
 * Flush all enrollments for a semester
 */

const flushSemesterEnrollmentsHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { semesterId } = req.body;

  const semester = await SemesterModel.findById(semesterId);
  if (!semester) {
    return res.status(404).json({
      errors: [
        {
          message: "Semester not found",
        },
      ],
    });
  }
  await EnrollmentModel.deleteMany({ semesterId });

  return res.status(200).json({
    message: `Enrollments for semester ${semesterId} flushed successfully`,
  });
};

export default flushSemesterEnrollmentsHandler;
