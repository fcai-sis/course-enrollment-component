import { Request, Response } from "express";

import { EnrollmentModel, IEnrollment, IHall } from "@fcai-sis/shared-models";

/**
 * Update an existing enrollment's course properties (status, seat number, exam hall)
 */
type HandlerRequest = Request<
  {},
  {},
  {
    enrollment: IEnrollment & Document;
    status?: "enrolled" | "passed" | "failed";
    seatNumber?: number;
    examHall?: IHall & Document;
  }
>;
// TODO: figure out why tf i can't attach the actual enrollment to the request body
const updateEnrollmentHandler = async (req: HandlerRequest, res: Response) => {
  const { status, seatNumber, examHall, enrollment } = req.body;

  const updatedEnrollment = await EnrollmentModel.findByIdAndUpdate(
    enrollment,
    {
      ...(status && { status }),
      ...(seatNumber && { seatNumber }),
      ...(examHall && { examHall }),
    },
    {
      new: true,
    }
  );

  await updatedEnrollment.save();

  return res.status(200).json({
    message: "Enrollment updated successfully",
  });
};

export default updateEnrollmentHandler;
