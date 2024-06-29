import { Request, Response } from "express";
import  { EvaluationQuestionModel, EvaluationQuestionType } from "../../data/models/evaluationQuestion.model";

type HandlerRequest = Request<
    {},
    {},
    {
        evaluationQuestion: EvaluationQuestionType;
    }
>;

/**
 * Creates a new evaluation question
 */
export const createEvaluationQuestionHandler = async (req: HandlerRequest, res: Response) => {
    const { evaluationQuestion } = req.body;
    const createdEvaluationQuestion = await EvaluationQuestionModel.create(
        {
            question: evaluationQuestion.question,
            type: evaluationQuestion.type,
        });

        const response = {
            evaluationQuestion: {
                name: createdEvaluationQuestion.question,
                type: createdEvaluationQuestion.type,
            }
        };
        return res.status(201).json(response);
};

export default createEvaluationQuestionHandler;


