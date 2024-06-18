import { EnrollmentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  { enrollmentId: string },
  {},
  { scores: { description: string; score: number }[] }
>;

/*
 * Updates existing grade scores in an existing enrollment
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const { enrollmentId } = req.params;
  const { scores } = req.body;

  const enrollment = await EnrollmentModel.findById(enrollmentId);
  if (!enrollment) {
    return res.status(404).json({
      message: "Enrollment not found",
    });
  }

  // Update each score in the scores array
  scores.forEach((scoreEntry) => {
    const scoreIndex = enrollment.scores.findIndex(
      (score: any) => score.description === scoreEntry.description
    );
    if (scoreIndex !== -1) {
      enrollment.scores[scoreIndex].score = scoreEntry.score;
    }
  });

  await enrollment.save();

  const response = {
    message: "Scores updated successfully",
    enrollment,
  };

  return res.status(200).json(response);
};

const updateScoreHandler = handler;
export default updateScoreHandler;
