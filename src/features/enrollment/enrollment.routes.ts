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

export default (router: Router) => {
  router.post(
    "/create",

    // Ensure the user is a student
    checkRole([Role.STUDENT]),

    validateCreateEnrollmentRequestMiddleware,

    validateEnrollmentMiddleware,

    asyncHandler(createEnrollmentHandler)
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
};
