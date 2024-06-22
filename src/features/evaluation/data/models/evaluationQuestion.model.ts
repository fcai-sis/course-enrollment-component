import mongoose, { InferSchemaType, Schema } from "mongoose";
import { QuestionTypes } from "../enums/questionTypes.enum";


export const evaluationQuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: QuestionTypes,
    required: true,
  },
});

export type EvaluationQuestionType = InferSchemaType<typeof evaluationQuestionSchema>;

export const evaluationQuestionModelName = "EvaluationQuestion";

const EvaluationQuestionModel = mongoose.model<EvaluationQuestionType>(
  evaluationQuestionModelName,
  evaluationQuestionSchema
);

export default EvaluationQuestionModel;