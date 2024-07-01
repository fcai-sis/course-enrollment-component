import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  EnrollmentModel,
  SemesterModel,
  SemesterCourseModel,
  CoursePrerequisiteModel,
  StudentModel,
  UserModel,
  EnrollmentStatusEnum,
  CourseTypeEnum,
  AcademicStudentModel,
  dynamicConfigModel,
} from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type CourseToEnrollIn = {
  courseCode: string;
  group?: string;
};

type HandlerRequest = Request<
  {},
  {},
  {
    user: TokenPayload;
    coursesToEnrollIn: CourseToEnrollIn[];
  }
>;

/**
 * Creates multiple enrollments for a student in multiple courses
 */
const enrollInCoursesHandler = async (req: HandlerRequest, res: Response) => {
  const { user, coursesToEnrollIn } = req.body;

  const studentUser = await UserModel.findById(user.userId);
  if (!studentUser)
    return res.status(404).json({
      error: {
        message: "User not found",
      },
    });

  const student = await StudentModel.findOne({
    user: studentUser._id,
  }).populate("bylaw");
  if (!student)
    return res.status(404).json({
      error: {
        message: "Student not found",
      },
    });
  const studentId = student._id;

  const latestSemester = await SemesterModel.findOne(
    {},
    {},
    { sort: { startDate: -1 } }
  );
  if (!latestSemester)
    return res.status(404).json({
      error: {
        message: "No semester found",
      },
    });
  const latestSemesterId = latestSemester._id;

  const coursesAvailableThisSemester = await SemesterCourseModel.find({
    semester: latestSemesterId,
  }).populate("course");

  const coursesToEnrollInThatAreNotAvailableThisSemester =
    coursesToEnrollIn.filter((courseToEnrollIn) => {
      const codesForCoursesThatAreAvailableThisSemester =
        coursesAvailableThisSemester.map(
          (availableCourse) => availableCourse.course.code
        );
      return !codesForCoursesThatAreAvailableThisSemester.includes(
        courseToEnrollIn.courseCode
      );
    });

  if (coursesToEnrollInThatAreNotAvailableThisSemester.length > 0) {
    return res.status(400).json({
      error: {
        message: "Some courses are not available this semester",
        courses: coursesToEnrollInThatAreNotAvailableThisSemester,
      },
    });
  }

  const coursesToEnrollInThatAreAvailableThisSemester =
    coursesAvailableThisSemester.filter((availableCourse) =>
      coursesToEnrollIn.some((courseToEnrollIn) => {
        return availableCourse.course.code === courseToEnrollIn.courseCode;
      })
    );

  const isGradProjectInCoursesToEnrollIn =
    coursesToEnrollInThatAreAvailableThisSemester.some(
      (course) => course.course.courseType === CourseTypeEnum[2]
    );

  if (isGradProjectInCoursesToEnrollIn) {
    const config = await dynamicConfigModel.findOne();

    if (!config) {
      return res.status(500).json({
        error: {
          message: "No configuration found",
        },
      });
    }

    if (!config.isGradProjectRegisterOpen) {
      return res.status(403).json({
        error: {
          message: "Not allowed to register graduation projects at this time",
        },
      });
    }
    // check if the student is eligible to enroll in a graduation project via the bylaw
    const academicStudent = await AcademicStudentModel.findOne({
      student: studentId,
    }).populate("major");
    if (!academicStudent) {
      return res.status(400).json({
        error: {
          message: "Student not found",
        },
      });
    }
    const studentMajor = academicStudent.major.code;
    const studentGradProjectBylaw = student.bylaw.graduationProjectRequirements;
    let projectRequirements: any = null;

    // graduation project requirements is a map of major to graduation project requirements, each major has mandatory hours, elective hours and total hours

    // loop over studentGradProjectRequirements and find the key that matches the student major code
    // if the key is found, assign the value to studentGradProjectRequirements
    studentGradProjectBylaw.forEach((gradProjectBylaw: any, key: any) => {
      if (key === studentMajor) {
        projectRequirements = gradProjectBylaw;
      }
    });
    const studentCreditHours = {
      mandatoryHours: academicStudent.mandatoryHours,
      electiveHours: academicStudent.electiveHours,
      totalHours:
        academicStudent.mandatoryHours + academicStudent.electiveHours,
    };
    if (student.bylaw.useDetailedGraduationProjectHours) {
      if (
        studentCreditHours.mandatoryHours < projectRequirements.mandatoryHours
      ) {
        return res.status(400).json({
          error: {
            message: "Student does not meet the mandatory hours requirement",
          },
        });
      }
      if (
        studentCreditHours.electiveHours < projectRequirements.electiveHours
      ) {
        return res.status(400).json({
          error: {
            message: "Student does not meet the elective hours requirement",
          },
        });
      }
    } else {
      if (studentCreditHours.totalHours < projectRequirements.totalHours) {
        return res.status(400).json({
          error: {
            message: "Student does not meet the total hours requirement",
          },
        });
      }
    }
  }

  const studentsEnrollments = await EnrollmentModel.find({
    student: studentId,
  }).populate("course");

  const passedCourses = studentsEnrollments
    .filter((enrollment) => enrollment.status === EnrollmentStatusEnum[1])
    .map((enrollment) => enrollment.course);
  const enrolledCourses = studentsEnrollments.filter(
    (enrollment) => enrollment.status === EnrollmentStatusEnum[0]
  );

  const coursesToEnrollInThatAreAlreadyPassedOrEnrolledIn =
    coursesToEnrollInThatAreAvailableThisSemester.filter((courseToEnrollIn) => {
      const passedAndEnrolledCourses = [
        ...passedCourses,
        ...enrolledCourses.map((enrollment) => enrollment.course),
      ];

      return passedAndEnrolledCourses.some((passedOrEnrolledCourse) => {
        return passedOrEnrolledCourse.code === courseToEnrollIn.course.code;
      });
    });

  if (coursesToEnrollInThatAreAlreadyPassedOrEnrolledIn.length > 0) {
    return res.status(400).json({
      error: {
        message: "Some courses are already passed or enrolled in",
        courses: coursesToEnrollInThatAreAlreadyPassedOrEnrolledIn,
      },
    });
  }

  const prerequisitesOfCoursesToEnrollIn = (
    await CoursePrerequisiteModel.find({
      course: {
        $in: coursesToEnrollInThatAreAvailableThisSemester.map(
          (course) => course.course._id
        ),
      },
    }).populate("prerequisite")
  ).map((coursePrerequisite) => coursePrerequisite.prerequisite);

  const prerequisitesNotMet = prerequisitesOfCoursesToEnrollIn.filter(
    (prerequisite) =>
      !passedCourses.some(
        (course) => course._id.toString() === prerequisite._id.toString()
      )
  );

  if (prerequisitesNotMet.length > 0) {
    return res.status(400).json({
      error: {
        message: "Prerequisites not met",
        prerequisites: prerequisitesNotMet.map(
          (prerequisite) => prerequisite.code
        ),
      },
    });
  }

  for (const courseToEnrollIn of coursesToEnrollInThatAreAvailableThisSemester) {
    await EnrollmentModel.create({
      student: studentId,
      course: courseToEnrollIn.course._id,
      semester: latestSemesterId,
      group: courseToEnrollIn.group,
    });
  }

  return res.status(201).json({
    message: "Courses enrolled in successfully",
  });
};

export default enrollInCoursesHandler;
