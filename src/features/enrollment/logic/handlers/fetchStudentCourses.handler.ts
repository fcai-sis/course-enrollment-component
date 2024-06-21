import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  EnrollmentModel,
  StudentModel,
  UserModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
  }
>;

const fetchStudentCoursesHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { user } = req.body;

  const studentUser = await UserModel.findById(user.userId);
  const student = await StudentModel.findOne({ user: studentUser._id });

  const enrollments = await EnrollmentModel.find({
    student: student._id,
  })
    .populate("course")
    .populate("exam.hall");

  res.status(200).json(enrollments);
};

export default fetchStudentCoursesHandler;
