import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import validateStudentPreferenceRequestMiddleware from "./logic/middlewares/validateStudentPreferenceRequest.middleware";
import submitStudentPreferenceHandler from "./logic/handlers/submitStudentPreference.handler";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";

const studentPreferenceRoutes = (router: Router) => {
  router.post(
    "/",
    checkRole([Role.STUDENT]),

    validateStudentPreferenceRequestMiddleware,

    asyncHandler(submitStudentPreferenceHandler)
  );
};

export default studentPreferenceRoutes;
