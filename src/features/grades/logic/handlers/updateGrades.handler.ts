import { EnrollmentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  { enrollmentId: string },
  {},
  {
    grades: {
      finalExam?: number;
      termWork?: number;
    };
  }
>;

/*
 * Updates the grades of an existing enrollment
 * */
const updateGradesHandler = async (req: HandlerRequest, res: Response) => {
  const { enrollmentId } = req.params;
  const { grades } = req.body;

  const enrollment = await EnrollmentModel.findByIdAndUpdate(
    enrollmentId,
    {
      ...(grades && {
        "grades.finalExam": grades.finalExam,
        "grades.termWork": grades.termWork,
      }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!enrollment) {
    return res.status(404).json({
      error: {
        message: "Enrollment not found",
      },
    });
  }

  await enrollment.save();

  const response = {
    message: "Grades updated successfully",
    enrollment,
  };

  return res.status(200).json(response);
};

export default updateGradesHandler;
