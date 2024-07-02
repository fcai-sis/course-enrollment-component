import {
  instructorTeachingModelName,
  semesterModelName,
  taTeachingModelName,
} from "@fcai-sis/shared-models";
import { enrollmentModelName } from "@fcai-sis/shared-models";
import { ForeignKeyNotFound } from "@fcai-sis/shared-utilities";
import mongoose, { InferSchemaType } from "mongoose";

const graduationProjectTeamSchema = new mongoose.Schema({
  enrollments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: enrollmentModelName,
  },

  instructorTeachings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: instructorTeachingModelName,
  },

  assistantTeachings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: taTeachingModelName,
  },

  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: semesterModelName,
  },
});

// Pre-save hook to ensure referential integrity
graduationProjectTeamSchema.pre("save", async function (next) {
  try {
    const enrollments = await mongoose
      .model(enrollmentModelName)
      .find({ _id: { $in: this.enrollments } });
    if (enrollments.length !== this.enrollments.length) {
      throw new ForeignKeyNotFound("Some enrollments not found");
    }

    const instructors = await mongoose
      .model(instructorTeachingModelName)
      .find({ _id: { $in: this.instructorTeachings } });
    if (instructors.length !== this.instructorTeachings.length) {
      throw new ForeignKeyNotFound("Some instructors not found");
    }

    const assistants = await mongoose
      .model(taTeachingModelName)
      .find({ _id: { $in: this.assistantTeachings } });
    if (assistants.length !== this.assistantTeachings.length) {
      throw new ForeignKeyNotFound("Some assistants not found");
    }

    next();
  } catch (error: any) {
    return next(error);
  }
});

export type GraduationProjectTeamType = InferSchemaType<
  typeof graduationProjectTeamSchema
>;

const graduationProjectTeamModelName = "GraduationProjectTeam";
export const GraduationProjectTeamModel =
  mongoose.model<GraduationProjectTeamType>(
    graduationProjectTeamModelName,
    graduationProjectTeamSchema
  );
export default GraduationProjectTeamModel;
