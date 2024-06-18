import { EnrollmentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  { enrollmentId: string },
  {},
  { finalExamScore: number }
>;

/*
 * Updates the final exam score of an existing enrollment
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const { enrollmentId } = req.params;
  const { finalExamScore } = req.body;

  const enrollment = await EnrollmentModel.findByIdAndUpdate(
    enrollmentId,
    {
      finalExamScore,
    },
    {
      new: true,
    }
  );

  await enrollment.save();

  const response = {
    message: "Final Exam Score updated successfully",
    enrollment,
  };

  return res.status(200).json(response);
};

const updateFinalExamScoreHandler = handler;
export default updateFinalExamScoreHandler;
