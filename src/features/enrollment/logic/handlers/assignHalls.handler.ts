import { Request, Response } from "express";
import {
  CourseModel,
  EnrollmentModel,
  HallModel,
} from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    minValue: number;
    maxValue: number;
    hall: string;
    course: string;
  }
>;

/**
 * Assigns halls to students from a specific range of student IDs
 */
const assignHallsHandler = async (req: HandlerRequest, res: Response) => {
  const { minValue, maxValue, hall, course } = req.body;
  const assignedHall = await HallModel.findById(hall);

  if (!assignedHall) {
    return res.status(404).json({
      errors: [
        {
          message: "Hall not found",
        },
      ],
    });
  }

  const courseRecord = await CourseModel.findOne({
    code: course,
  });

  if (!courseRecord) {
    return res.status(404).json({
      errors: [
        {
          message: "Course not found",
        },
      ],
    });
  }

  // find all enrollments for this course
  const enrollments = await EnrollmentModel.find({
    course: courseRecord._id,
  }).populate("student");
  if (enrollments.length === 0) {
    return res.status(404).json({
      errors: [
        {
          message: "No enrollments found for this course",
        },
      ],
    });
  }
  // filter through each enrollment such that each student.studentId is between minValue and maxValue (inclusive)
  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.student.studentId >= minValue &&
      enrollment.student.studentId <= maxValue
  );

  if (filteredEnrollments.length === 0) {
    return res.status(404).json({
      errors: [
        {
          message: "No enrollments found for this range of student IDs",
        },
      ],
    });
  }

  // Get all enrollments that are already assigned to the hall for this course
  const existingEnrollments = await EnrollmentModel.find({
    examHall: assignedHall,
    course: courseRecord,
  });

  // Get length of existing enrollments and check if it exceeds the hall capacity
  if (
    existingEnrollments.length + filteredEnrollments.length >
    assignedHall.capacity
  ) {
    return res.status(400).json({
      errors: [
        {
          message: "Hall capacity exceeded",
        },
      ],
    });
  }

  // Update each enrollment with the hall

  const updatedEnrollments = await Promise.all(
    filteredEnrollments.map(async (enrollment) => {
      enrollment.examHall = assignedHall;
      // assign the exam.seatNumber to a random number between 1 and hall.capacity and isn't already assigned to another student in the same hall
      // TODO: hacky way to assign seat numbers, should be improved
      let seatNumber = Math.floor(Math.random() * assignedHall.capacity) + 1;
      let found = false;
      while (!found) {
        const otherEnrollment = await EnrollmentModel.findOne({
          examHall: assignedHall,
          examSeatNumber: seatNumber,
        });
        if (!otherEnrollment) {
          found = true;
        } else {
          seatNumber = Math.floor(Math.random() * assignedHall.capacity) + 1;
        }
      }

      enrollment.examSeatNumber = seatNumber;

      return enrollment.save();
    })
  );

  if (updatedEnrollments.length === 0) {
    return res.status(500).json({
      errors: [
        {
          message: "Failed to assign halls to students",
        },
      ],
    });
  }

  const response = {
    message: "Halls assigned successfully",
  };

  return res.status(200).json(response);
};

export default assignHallsHandler;
