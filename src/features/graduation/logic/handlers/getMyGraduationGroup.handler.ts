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

  const student = await StudentModel.findOne({ user: userId });

  if (!student) {
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  }

  // TODO: figure out why i can't do the older query
  const studentEnrollment = await EnrollmentModel.find({
    student: student._id,
  }).populate({
    path: "course",
  });

  if (!studentEnrollment) {
    return res.status(404).json({
      errors: [
        {
          message: "Student enrollment not found",
        },
      ],
    });
  }

  const graduationEnrollment = studentEnrollment.find(
    (enrollment) => enrollment.course.courseType === "GRADUATION"
  );

  if (!graduationEnrollment) {
    return res.status(404).json({
      errors: [
        {
          message: "Graduation enrollment not found",
        },
      ],
    });
  }

  const graduationGroup = await GraduationProjectTeamModel.findOne({
    enrollments: graduationEnrollment._id,
  });

  if (!graduationGroup) {
    return res.status(404).json({
      errors: [
        {
          message: "Graduation group not found",
        },
      ],
    });
  }

  return res.status(200).json(graduationGroup);
};

const getMyGraduationGroupHandler = handler;

export default getMyGraduationGroupHandler;
