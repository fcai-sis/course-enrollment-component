import { Request, Response } from "express";
import {
  CourseTypeEnum,
  InstructorTeachingModel,
  SemesterModel,
  TaTeachingModel,
} from "@fcai-sis/shared-models";

/**
 * Gets all teachings that have a graduation project as the course
 */
const handler = async (req: Request, res: Response) => {
  const latestSemester = await SemesterModel.findOne(
    {},
    {},
    { sort: { createdAt: -1 } }
  );

  if (!latestSemester) {
    return res.status(404).json({
      errors: [
        {
          message: "There are no semesters at the moment",
        },
      ],
    });
  }
  const instructorTeachings = await InstructorTeachingModel.find({
    semester: latestSemester._id,
  })
    .populate("course")
    .populate("instructor");

  const taTeachings = await TaTeachingModel.find({
    semester: latestSemester._id,
  })
    .populate("course")
    .populate("ta");

  if (!instructorTeachings) {
    return res.status(404).json({
      errors: [
        {
          message: "There are no instructor teachings at the moment",
        },
      ],
    });
  }

  if (!taTeachings) {
    return res.status(404).json({
      errors: [
        {
          message: "There are no ta teachings at the moment",
        },
      ],
    });
  }

  const filteredInstructorTeachings = instructorTeachings.filter(
    (teaching) => teaching.course.courseType === CourseTypeEnum[2]
  );

  const filteredTaTeachings = taTeachings.filter(
    (teaching) => teaching.course.courseType === CourseTypeEnum[2]
  );

  if (!filteredInstructorTeachings) {
    return res.status(404).json({
      errors: [
        {
          message:
            "There are no graduation project instructor teachings at the moment",
        },
      ],
    });
  }

  if (!filteredTaTeachings) {
    return res.status(404).json({
      errors: [
        {
          message: "There are no graduation project ta teachings at the moment",
        },
      ],
    });
  }

  const response = {
    instructorTeachings: filteredInstructorTeachings,
    taTeachings: filteredTaTeachings,
  };

  return res.status(200).json(response);
};

const getAllGraduationProjectTeachingsHandler = handler;

export default getAllGraduationProjectTeachingsHandler;
