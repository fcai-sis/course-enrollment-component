import { Request, Response } from "express";
import { GraduationProjectTeamModel } from "../../data/models/gpt.model";
import mongoose from "mongoose";
import { EnrollmentType } from "../../../enrollment/data/models/enrollment.model";

type HandlerRequest = Request<
  {
    groupId: string;
  },
  {},
  {
    enrollments?: (EnrollmentType & Document)[];
    instructorTeachings?: mongoose.Schema.Types.ObjectId[];
    assistantTeachings?: mongoose.Schema.Types.ObjectId[];
    semester?: mongoose.Schema.Types.ObjectId;
  }
>;

/**
 * Updates a graduation project group.
 * */

const handler = async (req: HandlerRequest, res: Response) => {
  const { groupId } = req.params;
  const graduationProject = await GraduationProjectTeamModel.findByIdAndUpdate(
    groupId,
    {
      ...req.body,
    },
    {
      new: true,
    }
  );

  if (!graduationProject) {
    return res.status(404).json({
      message: "Graduation project group not found",
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
