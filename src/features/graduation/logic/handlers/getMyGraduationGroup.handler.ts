import { Request, Response } from "express";
import GraduationProjectTeamModel from "../../data/models/graduationteam.model";
import { Role, TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  CourseTypeEnum,
  EnrollmentModel,
  InstructorModel,
  InstructorTeachingModel,
  StudentModel,
  TaTeachingModel,
  TeachingAssistantModel,
} from "@fcai-sis/shared-models";
import { ObjectId } from "mongoose";

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
    semester: ObjectId;
  }
>;

/**
 * Gets a graduation group by the authenticated user's user ID
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { userId, role } = req.body.user;
  const { semester } = req.body;

  let user;

  // check role of user and await appropriate query
  if (role === Role.STUDENT) {
    user = await StudentModel.findOne({ user: userId });

    if (!user) {
      return res.status(404).json({
        errors: [
          {
            message: "Student not found",
          },
        ],
      });
    }

    // TODO: figure out why i can't do the older query
    const studentEnrollment = await EnrollmentModel.find({
      student: user._id,
    }).populate({
      path: "course",
    });

    if (!studentEnrollment) {
      return res.status(404).json({
        errors: [
          {
            message: "Student enrollment not found",
          },
        ],
      });
    }

    const graduationEnrollment = studentEnrollment.find(
      (enrollment) => enrollment.course.courseType === CourseTypeEnum[2]
    );

    if (!graduationEnrollment) {
      return res.status(404).json({
        errors: [
          {
            message: "Graduation enrollment not found",
          },
        ],
      });
    }

    const graduationGroup = await GraduationProjectTeamModel.findOne({
      enrollments: graduationEnrollment._id,
    })
      .populate("enrollments")
      .populate("instructorTeachings")
      .populate("assistantTeachings")
      .populate("semester");

    if (!graduationGroup) {
      return res.status(404).json({
        errors: [
          {
            message: "Graduation group not found",
          },
        ],
      });
    }
  } else if (role === Role.INSTRUCTOR) {
    user = await InstructorModel.findOne({ user: userId });

    if (!user) {
      return res.status(404).json({
        errors: [
          {
            message: "Instructor not found",
          },
        ],
      });
    }

    const instructorTeachings = await InstructorTeachingModel.find({
      semester,
    })
      .populate("course")
      .populate("instructor");

    if (!instructorTeachings) {
      return res.status(404).json({
        errors: [
          {
            message: "Instructor teachings not found",
          },
        ],
      });
    }

    const filteredInstructorTeachings = instructorTeachings.filter(
      (teaching) => teaching.course.courseType === CourseTypeEnum[2]
    );

    if (!filteredInstructorTeachings) {
      return res.status(404).json({
        errors: [
          {
            message:
              "There are no graduation project instructor teachings at the moment",
          },
        ],
      });
    }

    const graduationGroups = await GraduationProjectTeamModel.find(
      {
        instructorTeachings: { $in: filteredInstructorTeachings },
      },
      {
        __v: 0,
      }
    )
      .populate({
        path: "enrollments",
        populate: {
          path: "student",
        },
      })
      .populate({
        path: "instructorTeachings",
        populate: {
          path: "instructor",
        },
      })
      .populate({
        path: "assistantTeachings",
        populate: {
          path: "ta",
        },
      });

    if (!graduationGroups) {
      return res.status(404).json({
        errors: [
          {
            message: "Graduation groups not found",
          },
        ],
      });
    }

    return res.status(200).json(graduationGroups);
  } else if (role === Role.TEACHING_ASSISTANT) {
    user = await TeachingAssistantModel.findOne({
      user: userId,
    });

    if (!user) {
      return res.status(404).json({
        errors: [
          {
            message: "Teaching assistant not found",
          },
        ],
      });
    }

    const taTeachings = await TaTeachingModel.find({
      semester,
    })
      .populate("course")
      .populate("ta");

    if (!taTeachings) {
      return res.status(404).json({
        errors: [
          {
            message: "There are no ta teachings at the moment",
          },
        ],
      });
    }

    const filteredTaTeachings = taTeachings.filter(
      (teaching) => teaching.course.courseType === CourseTypeEnum[2]
    );

    if (!filteredTaTeachings) {
      return res.status(404).json({
        errors: [
          {
            message:
              "There are no graduation project ta teachings at the moment",
          },
        ],
      });
    }

    const graduationGroups = await GraduationProjectTeamModel.find(
      {
        assistantTeachings: { $in: filteredTaTeachings },
      },
      {
        __v: 0,
      }
    )
      .populate({
        path: "enrollments",
        populate: {
          path: "student",
        },
      })
      .populate({
        path: "instructorTeachings",
        populate: {
          path: "instructor",
        },
      })
      .populate({
        path: "assistantTeachings",
        populate: {
          path: "ta",
        },
      });

    if (!graduationGroups) {
      return res.status(404).json({
        errors: [
          {
            message: "Graduation group not found",
          },
        ],
      });
    }

    return res.status(200).json(graduationGroups);
  }
};

const getMyGraduationGroupHandler = handler;

export default getMyGraduationGroupHandler;
