import { Request, Response } from "express";

import {
  EnrollmentModel,
  EnrollmentStatusEnumType,
  IEnrollment,
  IHall,
} from "@fcai-sis/shared-models";

/**
 * Update an existing enrollment's properties (status, seat number, exam hall)
 */
type HandlerRequest = Request<
  {},
  {},
  {
    enrollment: IEnrollment;
    status?: EnrollmentStatusEnumType;
    exam?: {
      hall?: IHall;
      seatNumber?: number;
    };
  }
>;
// TODO: figure out why tf i can't attach the actual enrollment to the request body
const updateEnrollmentHandler = async (req: HandlerRequest, res: Response) => {
  const { status, exam, enrollment } = req.body;

  const updatedEnrollment = await EnrollmentModel.findByIdAndUpdate(
    enrollment,
    {
      ...(status && { status }),
      ...(exam && {
        "exam.hall": exam.hall,
        "exam.seatNumber": exam.seatNumber,
      }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedEnrollment) {
    return res.status(404).json({
      error: {
        message: "Enrollment not found",
      },
    });
  }

  await updatedEnrollment.save();

  return res.status(200).json({
    message: "Enrollment updated successfully",
  });
};

export default updateEnrollmentHandler;
