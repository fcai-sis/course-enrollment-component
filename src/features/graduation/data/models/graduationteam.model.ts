import {
  instructorTeachingModelName,
  semesterModelName,
  taTeachingModelName,
} from "@fcai-sis/shared-models";
import { enrollmentModelName } from "@fcai-sis/shared-models";
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
