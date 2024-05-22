import { Request, Response } from "express";

import { IEnrollment, IHall } from "@fcai-sis/shared-models";

/**
 * Update an existing enrollment's course properties (status, seat number, exam hall)
 */
type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {
    enrollment: IEnrollment & Document;
    status?: "enrolled" | "passed" | "failed";
    seatNumber?: number;
    examHall?: IHall & Document;
  }
>;

// TODO : add middleware
const updateEnrollmentHandler = async (req: HandlerRequest, res: Response) => {
  const { enrollment } = req.body;
  const { status, seatNumber, examHall } = req.body;

  // Update the enrollment object
  if (status) enrollment.status = status;
  if (seatNumber) enrollment.seatNumber = seatNumber;
  if (examHall) enrollment.examHall = examHall._id;

  await enrollment.save();

  return res.status(200).json({
    message: "Enrollment updated successfully",
  });
};

export default updateEnrollmentHandler;
