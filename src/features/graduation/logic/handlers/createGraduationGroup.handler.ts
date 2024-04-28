import mongoose from "mongoose";
import { Request, Response } from "express";
import GraduationProjectTeamModel from "../../data/models/graduationteam.model";
import { EnrollmentType } from "../../../enrollment/data/models/enrollment.model";

type HandlerRequest = Request<
  {},
  {},
  {
    enrollments: (EnrollmentType & Document)[];
    instructorTeachings: mongoose.Schema.Types.ObjectId[];
    assistantTeachings: mongoose.Schema.Types.ObjectId[];
    semester: mongoose.Schema.Types.ObjectId;
  }
>;

/*
 * Creates a graduation project group.
 * */
const handler = async (req: HandlerRequest, res: Response) => {
  const { enrollments, instructorTeachings, assistantTeachings, semester } =
    req.body;

  const graduationProject = new GraduationProjectTeamModel({
    enrollments,
    instructorTeachings,
    assistantTeachings,
    semester,
  });

  await graduationProject.save();

  const response = {
    message: "Graduation project group created successfully",
    graduationProject,
  };

  return res.status(201).json(response);
};

const CreateGraduationGroupHandler = handler;
export default CreateGraduationGroupHandler;
