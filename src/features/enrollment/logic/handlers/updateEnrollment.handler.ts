import { Request, Response } from "express";

import { EnrollmentType } from "../../data/models/enrollment.model";

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

/**
 * Update an existing enrollment's course properties (status, seat number, exam hall)
 */

// TODO : fix types
const updateEnrollmentHandler = async (req: Request, res: Response) => {
  const { enrollment } = req.body;
  const { courseId, status, seatNumber, examHall } = req.body;

  const courseToUpdate = enrollment.courses.find(
    (course: any) => course.courseId.toString() === courseId.toString()
  );

  if (!courseToUpdate) {
    return res.status(404).json({
      message: "Course not found in enrollment",
    });
  }

  if (status) {
    courseToUpdate.status = status;
  }

  if (seatNumber) {
    courseToUpdate.seatNumber = seatNumber;
  }

  if (examHall) {
    courseToUpdate.examHall = examHall;
  }

  await enrollment.save();

  return res.status(200).json({
    message: "Enrollment updated successfully",
  });
};

export default updateEnrollmentHandler;
