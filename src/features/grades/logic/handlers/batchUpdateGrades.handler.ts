import { EnrollmentModel, SemesterModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";
import { findDuplicateIDs } from "../../../utils/batch-upload.utils";

type HandlerRequest = Request<
    {},
    {
    },
    {
        grades: any[];
        course: string;
    }>;

/*
 * Updates the grades of an existing enrollment
 * */
const batchUpdateGradesHandler = async (req: HandlerRequest, res: Response) => {
    const grades = req.body.grades;
    const course = req.body.course;
    console.log("grades:", grades);

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
    const latestSemester = await SemesterModel.findOne(
        {},
        {},
        { sort: { startDate: -1 } }
    );

    const enrollments = await EnrollmentModel.find({
        course,
        semester: latestSemester._id,
        student: { $in: grades.map((grade: any) => grade.student) },
    });

    if(enrollments.length === 0) {
        return res.status(404).json({
            errors: [
                {
                    message: "No enrollments found for the provided course",
                },
            ],
        });
    }

    for (const enrollment of enrollments) {
        const grade = grades.find((grade: any) => grade.student === enrollment.student);
        if (!grade) {
            continue;
        }
        await EnrollmentModel.findByIdAndUpdate(
            enrollment._id,
            {
                termWorkMark: grade.mark
            },
            {
                runValidators: true,
            }
        );
    }

    return res.status(200).json({
        message: "Grades updated successfully",
    });
};

export default batchUpdateGradesHandler;