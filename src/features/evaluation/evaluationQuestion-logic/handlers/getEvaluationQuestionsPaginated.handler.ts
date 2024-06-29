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
 * Get all evaluation questions paginated
 */

const handler = async (req: HandlerRequest, res: Response) => {
  const type = req.query.type;

  const query = type ? { type } : {};

  const evaluationQuestions = await EvaluationQuestionModel.find(query)
    .skip(req.skip ?? 0)
    .limit(req.query.limit as unknown as number)
    .exec();

  const count = await EvaluationQuestionModel.countDocuments(query);
  const totalPages = Math.ceil(count / (req.query.limit as unknown as number));

  return res.status(200).json({
    evaluationQuestions,
    count,
    totalPages,
    pageSize: req.query.limit,
  });
};

const getEvaluationQuestionsPaginatedHandler = handler;
export default getEvaluationQuestionsPaginatedHandler;
