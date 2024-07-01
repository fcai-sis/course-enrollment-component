import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Router } from "express";
import getConfigSettingsHandler from "./handlers/getConfigSettings.handler";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import updateConfigSettingsHandler from "./handlers/updateConfig.handler";

const configRoutes = (router: Router) => {
  router.get(
    "/",
    checkRole([Role.ADMIN]),
    asyncHandler(getConfigSettingsHandler)
  );
  router.patch(
    "/",

    checkRole([Role.ADMIN]),
    asyncHandler(updateConfigSettingsHandler)
  );
};

export default configRoutes;
