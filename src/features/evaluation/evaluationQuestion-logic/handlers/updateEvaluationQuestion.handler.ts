import { Request, Response } from "express";
import { EvaluationQuestionModel } from "../../data/models/evaluationQuestion.model";


type HandlerRequest = Request<
  {
    evaluationQuestionId: string;
  },
  {},
  {
    question?: string;
    type?: string;
  }
>;

/**
 * Update Evaluation Question by its id.
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const evaluationQuestionId = req.params.evaluationQuestionId;
  const { question, type } = req.body;

  const evaluationQuestion = await EvaluationQuestionModel.findByIdAndUpdate(
    evaluationQuestionId,
    {
      question,
      type,
    },
    { new: true }
  );

  if (!evaluationQuestion) {
    return res.status(404).json({
      error: {
        message: "Evaluation question not found",
      },
    });
  }

  return res.status(200).json({
    message: "Evaluation question updated successfully",
    evaluationQuestion,
  });

};

const updateEvaluationQuestionHandler = handler;
export default updateEvaluationQuestionHandler;

