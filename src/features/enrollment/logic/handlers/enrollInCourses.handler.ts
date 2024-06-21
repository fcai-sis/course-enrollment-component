import { TokenPayload } from "@fcai-sis/shared-middlewares";
import {
  EnrollmentModel,
  SemesterModel,
  SemesterCourseModel,
  CoursePrerequisiteModel,
  StudentModel,
  UserModel,
  EnrollmentStatusEnum,
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
  if (!studentUser) return res.status(404).json({ message: "User not found" });

  const student = await StudentModel.findOne({ user: studentUser._id });
  if (!student) return res.status(404).json({ message: "Student not found" });
  const studentId = student._id;

  const latestSemester = await SemesterModel.findOne(
    {},
    {},
    { sort: { startDate: -1 } }
  );
  if (!latestSemester)
    return res.status(404).json({ message: "No semester found" });
  const latestSemesterId = latestSemester._id;

  const coursesAvailableThisSemester = (
    await SemesterCourseModel.find({
      semester: latestSemesterId,
    }).populate("course")
  ).map((semesterCourse) => semesterCourse.course);

  const coursesToEnrollInThatAreNotAvailableThisSemester =
    coursesToEnrollIn.filter(
      (courseToEnrollIn) =>
        !coursesAvailableThisSemester.some(
          (availableCourse) =>
            courseToEnrollIn.courseCode === availableCourse.courseCode
        )
    );

  if (coursesToEnrollInThatAreNotAvailableThisSemester.length > 0) {
    return res.status(400).json({
      message: "Some courses are not available this semester",
      courses: coursesToEnrollInThatAreNotAvailableThisSemester,
    });
  }

  const coursesToEnrollInThatAreAvailableThisSemester =
    coursesAvailableThisSemester.filter((availableCourse) =>
      coursesToEnrollIn.some(
        (courseToEnrollIn) =>
          courseToEnrollIn.courseCode === availableCourse.courseCode
      )
    );

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
    coursesToEnrollInThatAreAvailableThisSemester.filter((course) =>
      [...passedCourses, ...enrolledCourses].some(
        (enrollment) => enrollment.course.courseCode === course.courseCode
      )
    );

  if (coursesToEnrollInThatAreAlreadyPassedOrEnrolledIn.length > 0) {
    return res.status(400).json({
      message: "Some courses are already passed or enrolled in",
      courses: coursesToEnrollInThatAreAlreadyPassedOrEnrolledIn,
    });
  }

  const prerequisitesOfCoursesToEnrollIn = (
    await CoursePrerequisiteModel.find({
      course: {
        $in: coursesToEnrollInThatAreAvailableThisSemester.map(
          (course) => course._id
        ),
      },
    })
  ).map((coursePrerequisite) => coursePrerequisite.prerequisite);

  const prerequisitesNotMet = prerequisitesOfCoursesToEnrollIn.filter(
    (prerequisite) =>
      !passedCourses.some(
        (course) => course._id.toString() === prerequisite.toString()
      )
  );

  if (prerequisitesNotMet.length > 0) {
    return res.status(400).json({
      message: "Prerequisites not met",
      prerequisites: prerequisitesNotMet,
    });
  }

  for (const courseToEnrollIn of coursesToEnrollInThatAreAvailableThisSemester) {
    await EnrollmentModel.create({
      student: studentId,
      course: courseToEnrollIn._id,
      semester: latestSemesterId,
      group: courseToEnrollIn.group,
    });
  }

  return res.status(201).json({
    message: "Courses enrolled in successfully",
  });
};

export default enrollInCoursesHandler;
