import { Request, Response } from "express";
import { studentPreferenceModel } from "../../data/models/studentPreference.model";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  AcademicStudentModel,
  DepartmentModel,
  StudentModel,
} from "@fcai-sis/shared-models";

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

  // we need to convert the department codes to department ids
  const mapCodeToId = async (code: string) => {
    const department = await DepartmentModel.findOne({ code }).select("_id");

    return department?._id;
  };

  const preferencesIds = await Promise.all(preferences.map(mapCodeToId));

  const studentPreference = new studentPreferenceModel({
    student: authenticatedStudent._id,
    preferences: preferencesIds,
  });

  await studentPreference.save();

  return res.status(200).json({
    message: "Student preferences submitted successfully",
  });
};

const submitStudentPreferenceHandler = handler;
export default submitStudentPreferenceHandler;
