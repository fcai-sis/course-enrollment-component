import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import getPassedCoursesMiddleware from "./logic/middlewares/getPassedCourses.middleware";
import enrollCourseHandler from "./logic/handlers/enrollCourse.handler";
import fetchEligibleCourses from "./logic/handlers/fetchEligibleCourses.handler";
import createEnrollment from "./logic/handlers/createEnrollment.handler";
import coursePassedHandler from "./logic/handlers/passCourse.handler";

export default (router: Router) => {
  router.post("/create", asyncHandler(createEnrollment));

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

  router.post("/pass", asyncHandler(coursePassedHandler));
};
