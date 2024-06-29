import { Request, Response } from "express";
import { EvaluationQuestionModel } from "../../data/models/evaluationQuestion.model";

type HandlerRequest = Request<{ evaluationQuestionId: string }, {}, {}>;

/**
 * Delete a Evaluation Question by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const evaluationQuestionId = req.params.evaluationQuestionId;

  const evaluationQuestion = await EvaluationQuestionModel.findByIdAndDelete(evaluationQuestionId);

  if (!evaluationQuestion) {
    return res.status(404).json({
      error: {
        message: "Evaluation question not found",
      },
    });
  }

  const response = {
    message: "Evaluation Question deleted successfully",
    evaluationQuestion: {
      ...evaluationQuestion.toObject(),
    },
  };

  return res.status(200).json(response);
};

const deleteEvaluationQuestionHandler = handler;
export default deleteEvaluationQuestionHandler;
