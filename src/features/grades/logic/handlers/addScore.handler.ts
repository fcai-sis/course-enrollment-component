import { EnrollmentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  { enrollmentId: string },
  {},
  { scores: { description: string; score: number }[] }
>;

/*
 * Adds new grade scores to an existing enrollment
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

  // Add each new score to the scores array
  scores.forEach((scoreEntry) => {
    enrollment.scores.push(scoreEntry);
  });

  await enrollment.save();

  const response = {
    message: "Scores added successfully",
    enrollment,
  };

  return res.status(200).json(response);
};

const addScoreHandler = handler;
export default addScoreHandler;
