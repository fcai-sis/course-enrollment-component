import mongoose, { InferSchemaType, Schema } from "mongoose";
import { QuestionTypes } from "../enums/questionTypes.enum";

export interface IEvaluationQuestion extends mongoose.Document {
  question: {
    en: string;
    ar: string;
  };
  type: string;
};

export type EvaluationQuestionType = Omit<IEvaluationQuestion, keyof mongoose.Document>;

export const evaluationQuestionSchema = new mongoose.Schema<IEvaluationQuestion>({
  question: {
    en: {
      type: String,
      required: true,
    },
    ar: {
      type: String,
      required: true,
    },
  },
  type: {
    type: String,
    enum: QuestionTypes,
    required: true,
  },
});

export const evaluationQuestionModelName = "EvaluationQuestion";

export const EvaluationQuestionModel = mongoose.models[evaluationQuestionModelName] ||
  mongoose.model<IEvaluationQuestion>(evaluationQuestionModelName, evaluationQuestionSchema);

  export const evaluationQuestionLocalizedFields = {
    question: {
      en: "Question",
      ar: "السؤال"
    },
    type: {
      en: "Type",
      ar: "النوع"
    }
  };
