import { Request, Response } from "express";
import { EvaluationAnswerModel, EvaluationAnswerType } from "../../data/models/evaluationAnswer.model";

type HandlerRequest = Request<
    {},
    {},
    {
        enrollment: string;
        evaluationAnswers: Omit<EvaluationAnswerType, "enrollment">[];

    }
>;

/**
 * Creates a new evaluation answer
 */
export const submitEvaluationAnswersHandler = async (req: HandlerRequest, res: Response) => {
    const { enrollment, evaluationAnswers } = req.body;
    const createdEvaluationAnswers = await EvaluationAnswerModel.insertMany(
        evaluationAnswers.map((evaluationAnswer) => ({
            ...evaluationAnswer,
            enrollment: enrollment,
        }))
    );

    return res.status(201).json({
        message: "Evaluation answers created successfully",
        evaluationAnswers: createdEvaluationAnswers,
    });
}

export default submitEvaluationAnswersHandler;



