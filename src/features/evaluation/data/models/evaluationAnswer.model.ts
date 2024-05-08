import mongoose, { InferSchemaType, Schema } from "mongoose";
import { evaluationQuestionModelName } from "./evaluationQuestion.model";
import { enrollmentModelName } from "../../../enrollment/data/models/enrollment.model";
import { ForeignKeyNotFound } from "../../../utils/customError.exception";


export const evaluationAnswerSchema = new Schema({
    questionId: {
        type: Schema.Types.ObjectId,
        ref: evaluationQuestionModelName,
        required: true,
    },
    enrollmentId: {
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
            .findById(this.enrollmentId);
        if (!enrollment) {
            throw new ForeignKeyNotFound("Enrollment not found", "foreign-key-not-found");
        }

        const question = await mongoose
            .model(evaluationQuestionModelName)
            .findById(this.questionId);
        if (!question) {
            throw new ForeignKeyNotFound("Evaluation question not found", "foreign-key-not-found");
        }

        next();
    } catch (error: any) {
        return next(error);
    }
});


export type EvaluationAnswerType = InferSchemaType<typeof evaluationAnswerSchema>;

export const evaluationAnswerModelName = "EvaluationAnswer";

const EvaluationAnswerModel = mongoose.model<EvaluationAnswerType>(
    evaluationAnswerModelName,
    evaluationAnswerSchema
);

export default EvaluationAnswerModel;
