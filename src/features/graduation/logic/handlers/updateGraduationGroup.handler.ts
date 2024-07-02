import { Request, Response } from "express";
import { GraduationProjectTeamModel } from "../../data/models/graduationteam.model";
import mongoose from "mongoose";
import {
  IEnrollment,
  IInstructorTeaching,
  ISemester,
  ITaTeaching,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {
    groupId: string;
  },
  {},
  {
    enrollments?: IEnrollment[];
    instructorTeachings?: IInstructorTeaching[];
    assistantTeachings?: ITaTeaching[];
    semester?: ISemester;
  }
>;

/**
 * Updates a graduation project group.
 * */

const handler = async (req: HandlerRequest, res: Response) => {
  const { groupId } = req.params;
  const { enrollments, instructorTeachings, assistantTeachings, semester } =
    req.body;
  const graduationProject = await GraduationProjectTeamModel.findByIdAndUpdate(
    groupId,
    {
      ...(enrollments && { enrollments }),
      ...(instructorTeachings && { instructorTeachings }),
      ...(assistantTeachings && { assistantTeachings }),
      ...(semester && { semester }),
    },
    {
      new: true,
    }
  );

  if (!graduationProject) {
    return res.status(404).json({
      errors: [
        {
          message: "Graduation project group not found",
        },
      ],
    });
  }

  const response = {
    message: "Graduation project group updated successfully",
    graduationProject,
  };

  return res.status(200).json(response);
};

const updateGraduationGroupHandler = handler;
export default updateGraduationGroupHandler;
