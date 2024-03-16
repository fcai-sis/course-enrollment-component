import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createEnrollmentHandler from "./logic/handlers/createEnrollment.handler";
import fetchEligibleCourses from "./logic/handlers/fetchEligibleCourses.handler";
import getPassedCoursesMiddleware from "./logic/middlewares/getPassedCourses.middleware";
import ensureEnrollmentExistsMiddleware from "./logic/middlewares/ensureEnrollmentExists.middleware";
import validateCreateEnrollmentRequestMiddleware from "./logic/middlewares/validateCreateEnrollmentRequest.middleware";
import fetchEnrolledCourses from "./logic/handlers/fetchEnrolledCourses.handler";

export default (router: Router) => {
  router.post(
    "/create",
    validateCreateEnrollmentRequestMiddleware,
    ensureEnrollmentExistsMiddleware,
    asyncHandler(createEnrollmentHandler)
  );

  router.get(
    "/courses/:studentId",
    getPassedCoursesMiddleware,
    asyncHandler(fetchEligibleCourses)
  );

  router.get("/enrolled/:studentId", asyncHandler(fetchEnrolledCourses));
};
