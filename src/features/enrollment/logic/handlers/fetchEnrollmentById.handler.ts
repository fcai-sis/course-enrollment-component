import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  EnrollmentModel,
  StudentModel,
  UserModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  { enrollment: string },
  {},
  {
    user: TokenPayload;
  }
>;

const fetchEnrollmentByIdHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { user } = req.body;
  const { enrollment: enrollmentId } = req.params;

  const student = await StudentModel.findOne({ user: user.userId });
  if (!student)
    return res.status(404).json({
      errors: [
        {
          message: "Student not found",
        },
      ],
    });
  const studentId = student._id;

  const enrollment = await EnrollmentModel.findById(enrollmentId, {
    student: studentId,
  }).populate("course");

  if (!enrollment)
    return res.status(404).json({
      errors: [
        {
          message: "Enrollment not found",
        },
      ],
    });

  res.status(200).json({ enrollment });
};

export default fetchEnrollmentByIdHandler;
