import { Request, Response } from "express";
import { studentPreferenceModel } from "../../data/models/studentPreference.model";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { AcademicStudentModel, StudentModel } from "@fcai-sis/shared-models";

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

  const academicStudent = await AcademicStudentModel.findOne({
    student: authenticatedStudent._id,
  });

  if (!academicStudent) {
    return res.status(400).json({
      error: {
        message: "Student not found",
      },
    });
  }
  // TODO: bylaw field maybe?
  if (academicStudent.level < 3) {
    return res.status(400).json({
      error: {
        message:
          "You must be at least level 3 to submit department preferences",
      },
    });
  }

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
