import { asyncHandler } from "@fcai-sis/shared-utilities";
import CreateGraduationGroupHandler from "./logic/handlers/createGraduationGroup.handler";
import { Router } from "express";
import getGraduationGroupHandler from "./logic/handlers/getGraduationGroup.handler";
import ensureGroupIdInParamsMiddleware from "./logic/middlewares/ensureGroupIdInParams.middleware";

const graduationGroupRoutes = (router: Router) => {
  /**
   * Create a new graduation group
   */

  router.post(
    "/create",

    asyncHandler(CreateGraduationGroupHandler)
  );

  /**
   * Get a graduation group by its group code
   */
  router.get(
    "/:groupId",
    ensureGroupIdInParamsMiddleware,
    asyncHandler(getGraduationGroupHandler)
  );

  /**
   * Get all graduation groups
   */

  router.get(
    "/",

    asyncHandler(getGraduationGroupHandler)
  );
};

export default graduationGroupRoutes;
