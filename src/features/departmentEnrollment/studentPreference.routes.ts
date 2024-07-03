import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import validateStudentPreferenceRequestMiddleware from "./logic/middlewares/validateStudentPreferenceRequest.middleware";
import submitStudentPreferenceHandler from "./logic/handlers/submitStudentPreference.handler";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import assignDepartmentsBasedOnStudentPreferencesHandler from "./logic/handlers/assignDepartmentsBasedOnPreferences.handler";
import checkDepartmentEnrollConfigMiddleware from "./logic/middlewares/checkDepartmentEnrollConfig.middleware";

const studentPreferenceRoutes = (router: Router) => {
  router.post(
    "/",
    checkRole([Role.STUDENT]),
    checkDepartmentEnrollConfigMiddleware,
    validateStudentPreferenceRequestMiddleware,

    asyncHandler(submitStudentPreferenceHandler)
  );
  router.post(
    "/assign",
    checkDepartmentEnrollConfigMiddleware,
    asyncHandler(assignDepartmentsBasedOnStudentPreferencesHandler)
  );
};

export default studentPreferenceRoutes;
