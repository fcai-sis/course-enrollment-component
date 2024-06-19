import { Router } from "express";
import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";

import updateEnrollmentHandler from "./logic/handlers/updateEnrollment.handler";
import createEnrollmentHandler from "./logic/handlers/createEnrollment.handler";
import fetchEnrolledCourses from "./logic/handlers/fetchEnrolledCourses.handler";
import fetchEligibleCourses from "./logic/handlers/fetchEligibleCourses.handler";
import getPassedCoursesMiddleware from "./logic/middlewares/getPassedCourses.middleware";
import validateEnrollmentMiddleware from "./logic/middlewares/validateEnrollment.middleware";
import validateCreateEnrollmentRequestMiddleware from "./logic/middlewares/validateCreateEnrollmentRequest.middleware";
import validateUpdateEnrollmentRequestBodyMiddleware from "./logic/middlewares/updateEnrollmentRequestBody.middleware";
import adminCreateEnrollmentHandler from "./logic/handlers/adminCreateEnrollment.handler";
import flushSemesterEnrollmentsHandler from "./logic/handlers/flushSemesterEnrollments.handler";
import createMultiEnrollmentHandler from "./logic/handlers/createMultiEnrollment.handler";
import validateCreateMultiEnrollmentRequestMiddleware from "./logic/middlewares/validateCreateMultiEnrollment.middleware";
import validateFetchSemesterEnrollmentsMiddleware from "./logic/middlewares/validateFetchSemesterEnrollments.middleware";
import fetchAllSemesterEnrollmentsHandler from "./logic/handlers/fetchAllSemesterEnrollments.handler";

export default (router: Router) => {
  router.post(
    "/create",

    // Ensure the user is a student
    checkRole([Role.STUDENT]),

    validateCreateEnrollmentRequestMiddleware,

    validateEnrollmentMiddleware,

    asyncHandler(createEnrollmentHandler)
  );

  router.post(
    "/multicreate",

    // Ensure the user is a student
    checkRole([Role.STUDENT]),

    validateCreateMultiEnrollmentRequestMiddleware,

    validateEnrollmentMiddleware,

    asyncHandler(createMultiEnrollmentHandler)
  );

  router.get(
    "/courses",

    checkRole([Role.STUDENT]),

    getPassedCoursesMiddleware,

    asyncHandler(fetchEligibleCourses)
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

  router.post(
    "/forceenroll",

    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    asyncHandler(adminCreateEnrollmentHandler)
  );

  router.delete(
    "/flush",

    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    asyncHandler(flushSemesterEnrollmentsHandler)
  );

  router.get(
    "/",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    validateFetchSemesterEnrollmentsMiddleware,
    asyncHandler(fetchAllSemesterEnrollmentsHandler)
  );
};
