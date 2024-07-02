import { EnrollmentModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  { enrollmentId: string },
  {},
  {
    termWorkMark?: number;
    finalExamMark?: number;
  }
>;

/*
 * Updates the grades of an existing enrollment
 * */
const updateGradesHandler = async (req: HandlerRequest, res: Response) => {
  const { enrollmentId } = req.params;
  const { termWorkMark, finalExamMark } = req.body;

  const enrollment = await EnrollmentModel.findByIdAndUpdate(
    enrollmentId,
    {
      ...(termWorkMark && { termWorkMark }),
      ...(finalExamMark && { finalExamMark }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!enrollment) {
    return res.status(404).json({
      errors: [
        {
          message: "Enrollment not found",
        },
      ],
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
