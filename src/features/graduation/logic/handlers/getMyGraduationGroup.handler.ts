import { Request, Response } from "express";
import GraduationProjectTeamModel from "../../data/models/graduationteam.model";
import { TokenPayload } from "@fcai-sis/shared-middlewares";
import { EnrollmentModel, StudentModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
  }
>;

/**
 * Gets a graduation group by the authenticated student's user ID
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { userId } = req.body.user;

  const student = await StudentModel.findOne({
    userId,
  });

  if (!student) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }

  const studentEnrollment = await EnrollmentModel.findOne({
    studentId: student._id,
  }).populate({
    path: "courseId",
    match: { courseType: "graduation" },
    select: "courseType",
  });

  if (!studentEnrollment) {
    return res.status(404).json({
      error: {
        message: "Student enrollment not found",
      },
    });
  }

  const graduationGroup = await GraduationProjectTeamModel.findOne({
    enrollments: studentEnrollment._id,
  });

  if (!graduationGroup) {
    return res.status(404).json({
      message: "Graduation group not found",
    });
  }

  return res.status(200).json(graduationGroup);
};

const getMyGraduationGroupHandler = handler;

export default getMyGraduationGroupHandler;
