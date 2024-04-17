import { Request, Response } from "express";

import { EnrollmentType } from "../../data/models/enrollment.model";

/**
 * Update an existing enrollment's course properties (status, seat number, exam hall)
 */
type HandlerRequest = Request<
  {
    studentId: string;
  },
  {},
  {
    enrollment: EnrollmentType & Document;
    courseId: string;
    status?: "enrolled" | "passed" | "failed";
    seatNumber?: number;
    examHall?: string;
  }
>;


// TODO : fix types
const updateEnrollmentHandler = async (req: Request, res: Response) => {
  const { enrollment } = req.body;
  const { status, seatNumber, examHall } = req.body;

  // Update the enrollment object
  if (status) enrollment.status = status;
  if (seatNumber) enrollment.seatNumber = seatNumber;
  if (examHall) enrollment.examHall = examHall;

  await enrollment.save();

  return res.status(200).json({
    message: "Enrollment updated successfully",
  });
};

export default updateEnrollmentHandler;
