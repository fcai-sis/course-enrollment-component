import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import validateStudentPreferenceRequestMiddleware from "./logic/middlewares/validateStudentPreferenceRequest.middleware";
import submitStudentPreferenceHandler from "./logic/handlers/submitStudentPreference.handler";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import assignDepartmentsBasedOnStudentPreferencesHandler from "./logic/handlers/assignDepartmentsBasedOnPreferences.handler";

const studentPreferenceRoutes = (router: Router) => {
  router.post(
    "/",
    checkRole([Role.STUDENT]),

    validateStudentPreferenceRequestMiddleware,

    asyncHandler(submitStudentPreferenceHandler)
  );
  router.post(
    "/assign",

    asyncHandler(assignDepartmentsBasedOnStudentPreferencesHandler)
  );
};

export default studentPreferenceRoutes;
