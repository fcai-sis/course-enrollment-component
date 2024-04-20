import mongoose, { InferSchemaType } from "mongoose";

const graduationProjectTeamSchema = new mongoose.Schema({
  enrollments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Enrollment",
  },

  instructorTeachings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "InstructorTeaching",
  },

  assistantTeachings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "AssistantTeaching",
  },

  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
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
