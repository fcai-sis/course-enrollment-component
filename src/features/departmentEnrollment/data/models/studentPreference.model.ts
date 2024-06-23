import { departmentModelName, studentModelName } from "@fcai-sis/shared-models";
import { ForeignKeyNotFound } from "@fcai-sis/shared-utilities";
import mongoose, { Schema, Document } from "mongoose";

interface IStudentPreference extends Document {
  student: mongoose.Types.ObjectId;
  preferences: mongoose.Types.ObjectId[];
}

const studentPreferenceSchema = new mongoose.Schema<IStudentPreference>({
  student: {
    type: Schema.Types.ObjectId,
    ref: studentModelName,
    required: true,
  },
  preferences: [
    {
      type: Schema.Types.ObjectId,
      ref: departmentModelName,
    },
  ],
});

// Pre-save hook to ensure referential integrity
studentPreferenceSchema.pre("save", async function (next) {
  try {
    const departments = await mongoose
      .model(departmentModelName)
      .find({ _id: { $in: this.preferences } });
    if (departments.length !== this.preferences.length) {
      throw new ForeignKeyNotFound("Some departments not found");
    }

    next();
  } catch (error: any) {
    return next(error);
  }
});

export const studentPreferenceModelName = "StudentPreference";

export const studentPreferenceModel =
  mongoose.models.StudentPreference ||
  mongoose.model<IStudentPreference>(
    studentPreferenceModelName,
    studentPreferenceSchema
  );
