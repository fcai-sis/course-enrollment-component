import { Request, Response } from "express";
import StudentPreferenceModel from "features/departmentEnrollment/data/models/studentPreference.model";

type HandlerRequest = Request<
  {},
  {},
  {
    studentId: string;
    preferences: string[];
  }
>;

const handler = async (req: HandlerRequest, res: Response) => {
  const { studentId, preferences } = req.body;

  const studentPreference = new StudentPreferenceModel({
    studentId,
    preferences,
  });

  await studentPreference.save();

  return res.status(200).json({
    message: "Student preferences submitted successfully",
  });
};

const submitStudentPreferenceHandler = handler;
export default submitStudentPreferenceHandler;