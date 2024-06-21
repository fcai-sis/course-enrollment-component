import { Router } from "express";
import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import updateEnrollmentHandler from "./logic/handlers/updateEnrollment.handler";
import fetchEnrolledCourses from "./logic/handlers/fetchEnrolledCourses.handler";
import fetchEligibleCourses from "./logic/handlers/fetchEligibleCourses.handler";
import getPassedCoursesMiddleware from "./logic/middlewares/getPassedCourses.middleware";
import flushSemesterEnrollmentsHandler from "./logic/handlers/flushSemesterEnrollments.handler";
import enrollInCoursesHandler from "./logic/handlers/enrollInCourses.handler";
import validateFetchSemesterEnrollmentsMiddleware from "./logic/middlewares/validateFetchSemesterEnrollments.middleware";
import fetchAllSemesterEnrollmentsHandler from "./logic/handlers/fetchAllSemesterEnrollments.handler";
import fetchStudentCoursesHandler from "./logic/handlers/fetchStudentCourses.handler";
import validateEnrollInCoursesRequestMiddleware from "./logic/middlewares/validateEnrollIntoCourses.middleware";
import assignHallsHandler from "./logic/handlers/assignHalls.handler";
import validateAssignHallRequestMiddleware from "./logic/middlewares/assignHallRequest.middleware";
import validateUpdateEnrollmentRequestBodyMiddleware from "./logic/middlewares/updateEnrollmentRequestBody.middleware";

export default (router: Router) => {
  // Enroll in courses
  router.post(
    "/",
    checkRole([Role.STUDENT]),
    validateEnrollInCoursesRequestMiddleware,
    asyncHandler(enrollInCoursesHandler)
  );

  // Fetch eligible courses for a student
  router.get(
    "/eligible",
    checkRole([Role.STUDENT]),
    getPassedCoursesMiddleware,
    asyncHandler(fetchEligibleCourses)
  );

  // Fetch courses for a student
  router.get(
    "/mine",
    checkRole([Role.STUDENT]),
    getPassedCoursesMiddleware,
    asyncHandler(fetchStudentCoursesHandler)
  );

  router.get(
    "/enrolled",
    checkRole([Role.STUDENT]),
    asyncHandler(fetchEnrolledCourses)
  );

  router.patch(
    "/update",

    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    validateUpdateEnrollmentRequestBodyMiddleware,
    asyncHandler(updateEnrollmentHandler)
  );

  router.delete(
    "/flush",

    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    asyncHandler(flushSemesterEnrollmentsHandler)
  );

  router.get(
    "/:courseId",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    validateFetchSemesterEnrollmentsMiddleware,
    asyncHandler(fetchAllSemesterEnrollmentsHandler)
  );
  router.patch(
    "/assign-hall",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    validateAssignHallRequestMiddleware,
    asyncHandler(assignHallsHandler)
  );
};
