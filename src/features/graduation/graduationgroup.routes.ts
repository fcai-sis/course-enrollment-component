import { asyncHandler } from "@fcai-sis/shared-utilities";
import CreateGraduationGroupHandler from "./logic/handlers/createGraduationGroup.handler";
import { Router } from "express";
import getGraduationGroupByIdHandler from "./logic/handlers/getGraduationGroup.handler";
import ensureGroupIdInParamsMiddleware from "./logic/middlewares/ensureGroupIdInParams.middleware";
import updateGraduationGroupHandler from "./logic/handlers/updateGraduationGroup.handler";
import updateGraduationGroupRequestBodyMiddleware from "./logic/middlewares/updateGraduationGroupRequestBody.middleware";
import createGraduationGroupRequestBodyMiddleware from "./logic/middlewares/createGraduationGroupRequestBody.middleware";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";
import getAllGraduationGroupsHandler from "./logic/handlers/getAllGraduationGroups.handler";
import deleteGraduationGroupHandler from "./logic/handlers/deleteGraduationGroup.handler";

const graduationGroupRoutes = (router: Router) => {
  /**
   * Create a new graduation group
   */

  router.post(
    "/create",
    createGraduationGroupRequestBodyMiddleware,
    asyncHandler(CreateGraduationGroupHandler)
  );

  /**
   * Update a graduation group
   */

  router.patch(
    "/update/:groupId",
    ensureGroupIdInParamsMiddleware,
    updateGraduationGroupRequestBodyMiddleware,
    asyncHandler(updateGraduationGroupHandler)
  );

  /**
   * Get a graduation group by its group code
   */
  router.get(
    "/:groupId",
    ensureGroupIdInParamsMiddleware,
    asyncHandler(getGraduationGroupByIdHandler)
  );

  /**
   * Get all graduation groups
   */

  router.get(
    "/",
    paginationQueryParamsMiddleware,
    asyncHandler(getAllGraduationGroupsHandler)
  );

  router.delete(
    "/:groupId",
    ensureGroupIdInParamsMiddleware,
    asyncHandler(deleteGraduationGroupHandler)
  );
};

export default graduationGroupRoutes;
