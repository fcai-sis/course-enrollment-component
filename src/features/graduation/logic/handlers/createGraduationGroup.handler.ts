import { Request, Response } from "express";
import GraduationProjectTeamModel from "../../data/models/graduationteam.model";
import {
  IEnrollment,
  IInstructorTeaching,
  ISemester,
  ITaTeaching,
} from "@fcai-sis/shared-models";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    enrollments: IEnrollment[];
    instructorTeachings: IInstructorTeaching[];
    assistantTeachings: ITaTeaching[];
    semester: ObjectId;
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

  if (!graduationProject) {
    return res.status(500).json({
      errors: [
        {
          message: "Failed to create graduation project group",
        },
      ],
    });
  }

  const response = {
    message: "Graduation project group created successfully",
    graduationProject,
  };

  return res.status(201).json(response);
};

const CreateGraduationGroupHandler = handler;
export default CreateGraduationGroupHandler;
