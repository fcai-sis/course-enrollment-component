import { EnrollmentModel, SemesterModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { findDuplicateIDs } from "../../../utils/batch-upload.utils";

enum ExcelColumnsHeaders {
  finalExamMark = "finalExamMark",
  termWorkMark = "termWorkMark",
}

type HandlerRequest = Request<
  {},
  {},
  {
    grades: any[];
    course: string;
    excelColumnsHeaders: string[];
  }
>;

/*
 * Updates the grades of an existing enrollment
 * */
const batchUpdateGradesHandler = async (req: HandlerRequest, res: Response) => {
  const { grades, course, excelColumnsHeaders } = req.body;

  const duplicateIDs = findDuplicateIDs(grades);
  if (duplicateIDs.length > 0) {
    return res.status(400).json({
      errors: [
        {
          message: "Duplicate Student IDs found in the grades list",
          duplicates: duplicateIDs,
        },
      ],
    });
  }

  const latestSemester = await SemesterModel.findOne({}, {}, { sort: { startDate: -1 } });

  const enrollments = await EnrollmentModel.find({
    semester: latestSemester._id,
  })
    .populate({
      path: "course",
      match: { code: course },
    })
    .populate({
      path: "student",
      match: { studentId: { $in: grades.map((grade) => grade.studentId) } },
    });

  if (enrollments.length === 0) {
    return res.status(404).json({
      errors: [
        {
          message: "No enrollments found for the provided course",
        },
      ],
    });
  }

  for (const enrollment of enrollments) {
    const grade = grades.find(
      (grade: any) => grade.studentId.toString() === enrollment.student.studentId
    );
    if (!grade) {
      continue;
    }

    const updateFields: any = {};
    if (excelColumnsHeaders.includes(ExcelColumnsHeaders.finalExamMark) && grade.finalExamMark !== undefined) {
      updateFields.finalExamMark = grade.finalExamMark;
    }
    if (excelColumnsHeaders.includes(ExcelColumnsHeaders.termWorkMark) && grade.termWorkMark !== undefined) {
      updateFields.termWorkMark = grade.termWorkMark;
    }

    if (Object.keys(updateFields).length > 0) {
      await EnrollmentModel.findByIdAndUpdate(
        enrollment._id,
        updateFields,
        {
          runValidators: true,
        }
      );
    }
  }

  return res.status(200).json({
    message: "Grades updated successfully",
  });
};

export default batchUpdateGradesHandler;
