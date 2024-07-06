import { Request, Response } from "express";
import {
  EvaluationAnswerModel,
  EvaluationAnswerType,
} from "../../data/models/evaluationAnswer.model";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { EnrollmentModel, StudentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    enrollment: string;
    evaluationAnswers: Omit<EvaluationAnswerType, "enrollment">[];
    user: TokenPayload;
  }
>;

/**
 * Creates a new evaluation answer
 */
export const submitEvaluationAnswersHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { enrollment: submittedEnrollment, evaluationAnswers, user } = req.body;

  // check if the user is the same as the one who is submitting the evaluation answers
  const student = await StudentModel.findOne({ user: user.userId });
  if (!student) {
    return res.status(404).json({
      errors: [
        {
          message: "Student not found",
        },
      ],
    });
  }

  const enrollment = await EnrollmentModel.findById(submittedEnrollment);
  if (!enrollment) {
    return res.status(404).json({
      errors: [
        {
          message: "Enrollment not found",
        },
      ],
    });
  }

  // check if the enrollment belongs to the student
  if (enrollment.student.toString() !== student._id.toString()) {
    return res.status(403).json({
      errors: [
        {
          message:
            "You are not allowed to submit evaluation answers for this enrollment",
        },
      ],
    });
  }

  // delete all previous evaluation answers for this enrollment
  await EvaluationAnswerModel.deleteMany({ enrollment: submittedEnrollment });

  const createdEvaluationAnswers = await EvaluationAnswerModel.insertMany(
    evaluationAnswers.map((evaluationAnswer) => ({
      ...evaluationAnswer,
      enrollment: submittedEnrollment,
    }))
  );

  return res.status(201).json({
    message: "Evaluation answers created successfully",
    evaluationAnswers: createdEvaluationAnswers,
  });
};

export default submitEvaluationAnswersHandler;
