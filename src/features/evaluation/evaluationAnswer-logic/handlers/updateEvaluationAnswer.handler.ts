import { Request, Response } from "express";
import { EvaluationAnswerModel } from "../../data/models/evaluationAnswer.model";

type HandlerRequest = Request<
  {
    evaluationAnswerId: string;
  },
  {},
  {
    questionId?: string;
    answer?: number;
  }
>;

/**
 * Update Evaluation Answer by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const evaluationAnswerId = req.params.evaluationAnswerId;
  const { questionId, answer } = req.body;

  const evaluationAnswer = await EvaluationAnswerModel.findByIdAndUpdate(
    evaluationAnswerId,
    {
      questionId,
      answer,
    },
    { new: true }
  );

  if (!evaluationAnswer) {
    return res.status(404).json({
      errors: [
        {
          message: "Evaluation Answer not found",
        },
      ],
    });
  }

  return res.status(200).json({
    message: "Evaluation Answer updated successfully",
    evaluationAnswer,
  });
};

const updateEvaluationAnswerHandler = handler;
export default updateEvaluationAnswerHandler;
