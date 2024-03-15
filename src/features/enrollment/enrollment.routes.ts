import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import coursePassedHandler from "./logic/handlers/passCourse.handler";
import enrollCourseHandler from "./logic/handlers/enrollCourse.handler";
import createEnrollmentHandler from "./logic/handlers/createEnrollment.handler";
import fetchEligibleCourses from "./logic/handlers/fetchEligibleCourses.handler";
import getPassedCoursesMiddleware from "./logic/middlewares/getPassedCourses.middleware";
import ensureEnrollmentExistsMiddleware from "./logic/middlewares/ensureEnrollmentExists.middleware";
import validateCreateEnrollmentRequestMiddleware from "./logic/middlewares/validateCreateEnrollmentRequest.middleware";

export default (router: Router) => {
  router.post(
    "/create",
    validateCreateEnrollmentRequestMiddleware,
    ensureEnrollmentExistsMiddleware,
    asyncHandler(createEnrollmentHandler),
  );

  router.post(
    "/enroll/:studentId",
    getPassedCoursesMiddleware,
    asyncHandler(enrollCourseHandler)
  );

  router.get(
    "/courses/:studentId",
    getPassedCoursesMiddleware,
    asyncHandler(fetchEligibleCourses)
  );

  router.post(
    "/pass",
    asyncHandler(coursePassedHandler),
  );
};
