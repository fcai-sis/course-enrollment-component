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
  courses: {
    type: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: courseModelName,
          required: true,
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
      },
    ],
    required: true,
    default: [],
  },
});

export type EnrollmentType = InferSchemaType<
  typeof enrollmentSchema
>;

const enrollmentModelName = "Enrollment";

const EnrollmentModel = mongoose.model<EnrollmentType>(
  enrollmentModelName,
  enrollmentSchema
);

export { EnrollmentModel, enrollmentModelName };
