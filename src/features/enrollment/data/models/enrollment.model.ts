import mongoose, { InferSchemaType, Schema } from "mongoose";

import {
  courseModelName,
  hallModelName,
  studentModelName,
} from "@fcai-sis/shared-models";

// Each row in the enrollment collection represents a student's enrollments throughout the years
export const enrollmentSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: studentModelName,
    required: true,
  },

  groupName: {
    type: String,
    required: true,
  },

  semesterId: {
    type: Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: courseModelName,
    required: true,
  },
  courseCode: {
    type: String,
    ref: courseModelName,
    required: true,
    default: null,
  },
  status: {
    type: String,
    enum: ["enrolled", "passed", "failed"],
    default: "enrolled",
  },
  seatNumber: {
    type: Number,
    default: null,
  },
  examHall: {
    type: Schema.Types.ObjectId,
    ref: hallModelName,
    default: null,
  },
});

export type EnrollmentType = InferSchemaType<typeof enrollmentSchema>;

const enrollmentModelName = "Enrollment";

const EnrollmentModel = mongoose.model<EnrollmentType>(
  enrollmentModelName,
  enrollmentSchema
);

export { EnrollmentModel, enrollmentModelName };
