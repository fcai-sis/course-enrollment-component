import { Request, Response } from "express";
import EvaluationQuestionModel from "../../data/models/evaluationQuestion.model";

type HandlerRequest = Request<
    {},
    {},
    {
        question: string;
        type: string;
    }
>;

/**
 * Creates a new evaluation question
 */
export const createEvaluationQuestionHandler = async (req: HandlerRequest, res: Response) => {
    const { question, type } = req.body;
    const evaluationQuestion = new EvaluationQuestionModel({
        question,
        type,
    });

    await evaluationQuestion.save();

    return res.status(201).json({
        message: "Evaluation question created successfully",
        evaluationQuestion,
    });
};

export default createEvaluationQuestionHandler;


