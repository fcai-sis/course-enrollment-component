import { Request, Response } from "express";
import { studentPreferenceModel } from "../../data/models/studentPreference.model";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { StudentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    preferences: string[];
    user: TokenPayload;
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { user, preferences } = req.body;

  const authenticatedStudent = await StudentModel.findOne({
    user: user.userId,
  });

  const studentPreference = new studentPreferenceModel({
    student: authenticatedStudent._id,
    preferences,
  });

  await studentPreference.save();

  return res.status(200).json({
    message: "Student preferences submitted successfully",
  });
};

const submitStudentPreferenceHandler = handler;
export default submitStudentPreferenceHandler;
