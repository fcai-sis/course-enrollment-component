import mongoose, { InferSchemaType, Schema } from "mongoose";
import { evaluationQuestionModelName } from "./evaluationQuestion.model";
import { enrollmentModelName } from "@fcai-sis/shared-models";
import { ForeignKeyNotFound } from "../../../utils/customError.exception";

export interface IEvaluationAnswer extends mongoose.Document {
    question:  mongoose.Schema.Types.ObjectId;
    enrollment:  mongoose.Schema.Types.ObjectId;
    answer: number;
}

export type EvaluationAnswerType = Omit<IEvaluationAnswer, keyof mongoose.Document>;

export const evaluationAnswerSchema = new mongoose.Schema<IEvaluationAnswer>({
    question: {
        type: Schema.Types.ObjectId,
        ref: evaluationQuestionModelName,
        required: true,
    },
    enrollment: {
        type: Schema.Types.ObjectId,
        ref: enrollmentModelName,
        required: true,
    },
    answer: {
        type: Number,
        required: true,
    },
});


// Pre-save hook to ensure referential integrity
evaluationAnswerSchema.pre("save", async function (next) {
    try {
        const enrollment = await mongoose
            .model(enrollmentModelName)
            .findById(this.enrollment);
        if (!enrollment) {
            throw new ForeignKeyNotFound("Enrollment not found", "foreign-key-not-found");
        }

        const question = await mongoose
            .model(evaluationQuestionModelName)
            .findById(this.question);
        if (!question) {
            throw new ForeignKeyNotFound("Evaluation question not found", "foreign-key-not-found");
        }

        next();
    } catch (error: any) {
        return next(error);
    }
});


export const evaluationAnswerModelName = "EvaluationAnswer";

export const EvaluationAnswerModel = mongoose.models[evaluationAnswerModelName] ||
    mongoose.model<IEvaluationAnswer>(evaluationAnswerModelName, evaluationAnswerSchema);