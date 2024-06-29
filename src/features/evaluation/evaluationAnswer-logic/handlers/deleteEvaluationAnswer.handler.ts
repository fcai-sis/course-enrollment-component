import { Request, Response } from "express";
import { EvaluationAnswerModel } from "../../data/models/evaluationAnswer.model";

type HandlerRequest = Request<{ evaluationAnswerId: string }, {}, {}>;

/**
 * Delete a Evaluation answer by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const evaluationAnswerId = req.params.evaluationAnswerId;

  const evaluationAnswer = await EvaluationAnswerModel.findByIdAndDelete(evaluationAnswerId);

  if (!evaluationAnswer) {
    return res.status(404).json({
      error: {
        message: "Evaluation answer not found",
      },
    });
  }

  const response = {
    message: "Evaluation answer deleted successfully",
    evaluationAnswer: {
      ...evaluationAnswer.toObject(),
    },
  };

  return res.status(200).json(response);
};

const deleteEvaluationAnswerHandler = handler;
export default deleteEvaluationAnswerHandler;
