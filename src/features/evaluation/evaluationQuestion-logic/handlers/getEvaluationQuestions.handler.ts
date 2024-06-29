import { Request, Response } from "express";
import { EvaluationQuestionModel } from "../../data/models/evaluationQuestion.model";

type HandlerRequest = Request<
  {
    type?: string;
  },
  {},
  {}
>;

/**
 * Get all evaluation questions
 */

const handler = async (req: HandlerRequest, res: Response) => {
  const type = req.query.type;

  const query = type ? { type } : {};

  const evaluationQuestions = await EvaluationQuestionModel
    .find(query)
    .exec();

  return res.status(200).json({
    evaluationQuestions,
  });
}

const getEvaluationQuestionsHandler = handler;
export default getEvaluationQuestionsHandler;