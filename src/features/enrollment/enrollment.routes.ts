import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createEnrollmentHandler from "./logic/handlers/createEnrollment.handler";
import fetchEligibleCourses from "./logic/handlers/fetchEligibleCourses.handler";
import getPassedCoursesMiddleware from "./logic/middlewares/getPassedCourses.middleware";
import validateEnrollmentMiddleware from "./logic/middlewares/validateEnrollment.middleware";
import validateCreateEnrollmentRequestMiddleware from "./logic/middlewares/validateCreateEnrollmentRequest.middleware";
import fetchEnrolledCourses from "./logic/handlers/fetchEnrolledCourses.handler";
import updateEnrollmentHandler from "./logic/handlers/updateEnrollment.handler";
import adminCreateEnrollmentHandler from "./logic/handlers/adminCreateEnrollment.handler";
import ensureEnrollmentExistsMiddleware from "./logic/middlewares/ensureEnrollmentExists.middleware";

export default (router: Router) => {
  router.post(
    "/create",
    validateCreateEnrollmentRequestMiddleware,
    validateEnrollmentMiddleware,
    asyncHandler(createEnrollmentHandler)
  );

  router.post(
    "/admin/create",
    validateCreateEnrollmentRequestMiddleware,
    validateEnrollmentMiddleware,
    asyncHandler(adminCreateEnrollmentHandler)
  );

  router.get(
    "/courses/:studentId",
    getPassedCoursesMiddleware,
    asyncHandler(fetchEligibleCourses)
  );

  router.get("/enrolled/:studentId", asyncHandler(fetchEnrolledCourses));

  router.patch(
    "/update/",
    ensureEnrollmentExistsMiddleware,
    asyncHandler(updateEnrollmentHandler)
  );
};
