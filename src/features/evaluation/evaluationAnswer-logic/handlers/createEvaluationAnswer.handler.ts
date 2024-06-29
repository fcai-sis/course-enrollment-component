import { Request, Response } from "express";
import { EvaluationAnswerModel } from "../../data/models/evaluationAnswer.model";

type HandlerRequest = Request<
    {},
    {},
    {
        questionId: string;
        enrollmentId: string;
        answer: number;

    }
>;

/**
 * Creates a new evaluation answer
 */
export const createEvaluationAnswerHandler = async (req: HandlerRequest, res: Response) => {
    const { questionId, enrollmentId, answer } = req.body;
    const evaluationAnswer = new EvaluationAnswerModel({
        questionId,
        enrollmentId,
        answer,
    });

    await evaluationAnswer.save();

    return res.status(201).json({
        message: "Evaluation answer created successfully",
        evaluationAnswer,
    });
}

export default createEvaluationAnswerHandler;



