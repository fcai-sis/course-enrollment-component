import mongoose, { InferSchemaType, Schema } from "mongoose";

import {
  courseModelName,
  hallModelName,
  studentModelName,
} from "@fcai-sis/shared-models";

export const courseEnrollmentSchema = new Schema({
  student: {
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
          default: 0,
        },
        finalExamHall: {
          type: Schema.Types.ObjectId,
          ref: hallModelName,
          default: null,
        },
      },
    ],
    ref: courseModelName,
    required: true,
  },
});

export type CourseEnrollmentType = InferSchemaType<
  typeof courseEnrollmentSchema
>;

const courseEnrollmentModelName = "CourseEnrollment";
const CourseEnrollmentModel = mongoose.model<CourseEnrollmentType>(
  courseEnrollmentModelName,
  courseEnrollmentSchema
);

export { CourseEnrollmentModel, courseEnrollmentModelName };
