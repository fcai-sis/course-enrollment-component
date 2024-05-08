import { Request, Response } from "express";
import EvaluationQuestionModel from "../../data/models/evaluationQuestion.model";

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
  const page = req.context.page;
  const pageSize = req.context.pageSize;

  const query = type ? { type } : {};

  const evaluationQuestions = await EvaluationQuestionModel
    .find(query)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();

  const count = await EvaluationQuestionModel.countDocuments(query);
  const totalPages = Math.ceil(count / pageSize);

  return res.status(200).json({
    evaluationQuestions,
    count,
    totalPages,
    CurrentPage: page,
    pageSize: pageSize
  });
};

const getEvaluationQuestionsPaginatedHandler = handler;
export default getEvaluationQuestionsPaginatedHandler;