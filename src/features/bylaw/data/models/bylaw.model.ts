import mongoose, { InferSchemaType, Schema } from "mongoose";

// Define the sub-schema for level requirements

const gradeWeightValidator = (val: number) => {
  return val >= 0 && val <= 6;
};

const gradeSchema = new Schema({
  weight: {
    type: Number,
    validate: [gradeWeightValidator, "Grade weights must be between 0 and 6"],
    required: true,
  },
  percentage: {
    min: {
      type: Number,
      min: [0, "Percentage must be between 0 and 100"],
      max: [100, "Percentage must be between 0 and 100"],
      required: true,
    },
    max: {
      type: Number,
      min: [0, "Percentage must be between 0 and 100"],
      max: [100, "Percentage must be between 0 and 100"],
      required: true,
    },
  },
}, { _id: false });

const levelRequirementSchema = new Schema({
  mandatoryHours: {
    type: Number,
    min: [0, "mandatoryHours must be greater than or equal to 0"],
    required: function (this: any) {
      return this.parent().useDetailedHours;
    }
  },
  electiveHours: {
    type: Number,
    min: [0, "electiveHours must be greater than or equal to 0"],
    required: function (this: any) {
      return this.parent().useDetailedHours;
    }
  },
  totalHours: {
    type: Number,
    min: [0, "totalHours must be greater than or equal to 0"],
    required: function (this: any) {
      return !this.parent().useDetailedHours;
    }
  },
  maxYears: {
    type: Number,
    min: [1, "maxYears must be greater than or equal to 1"],
    required: true,
  },
}, { _id: false }); // _id: false to prevent Mongoose from creating an _id field for each sub-document

// Define the sub-schema for graduation project requirements
const graduationProjectRequirementSchema = new Schema({
  mandatoryHours: {
    type: Number,
    min: [0, "mandatoryHours must be greater than or equal to 0"],
    required: function (this: any) {
      return this.parent().useDetailedGraduationProjectHours;
    }
  },
  electiveHours: {
    type: Number,
    min: [0, "electiveHours must be greater than or equal to 0"],
    required: function (this: any) {
      return this.parent().useDetailedGraduationProjectHours;
    }
  },
  totalHours: {
    type: Number,
    min: [0, "totalHours must be greater than or equal to 0"],
    required: function (this: any) {
      return !this.parent().useDetailedGraduationProjectHours;
    }
  },
}, { _id: false }); // _id: false to prevent Mongoose from creating an _id field for each sub-document

// Main bylaw schema
export const bylawSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  // gradeWeights is a map of grade to weight { "A": 4, "B": 3, "C": 2, "D": 1, "F": 0} values must be between 0 and 6
  gradeWeights: {
    type: Map,
    of: gradeSchema,
    required: true,
  },
  gpaScale: {
    type: Number,
    required: true,
  },
  // Boolean to determine which hours to use
  useDetailedHours: {
    type: Boolean,
    required: true,
  },
  // boolean to determine if detailed hours are used for graduation project
  useDetailedGraduationProjectHours: {
    type: Boolean,
    required: true,
  },
  // Map of level to minimum credits required
  levelRequirements: {
    type: Map,
    of: levelRequirementSchema,
    required: true,
  },
  // Graduation project requirements by department
  graduationProjectRequirements: {
    type: Map,
    of: graduationProjectRequirementSchema,
    required: true,
  },

  yearApplied: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export type ByLawType = InferSchemaType<typeof bylawSchema>;

const bylawModelName = "ByLaw";

const BylawModel = mongoose.model<ByLawType>(
  bylawModelName,
  bylawSchema
);

export { BylawModel, bylawModelName };
