import { asyncHandler } from "@fcai-sis/shared-utilities";
import CreateGraduationGroupHandler from "./logic/handlers/createGraduationGroup.handler";
import { Router } from "express";
import getGraduationGroupByIdHandler from "./logic/handlers/getGraduationGroup.handler";
import ensureGroupIdInParamsMiddleware from "./logic/middlewares/ensureGroupIdInParams.middleware";
import updateGraduationGroupHandler from "./logic/handlers/updateGraduationGroup.handler";
import updateGraduationGroupRequestBodyMiddleware from "./logic/middlewares/updateGraduationGroupRequestBody.middleware";
import createGraduationGroupRequestBodyMiddleware from "./logic/middlewares/createGraduationGroupRequestBody.middleware";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import getAllGraduationGroupsHandler from "./logic/handlers/getAllGraduationGroups.handler";
import deleteGraduationGroupHandler from "./logic/handlers/deleteGraduationGroup.handler";
import getMyGraduationGroupHandler from "./logic/handlers/getMyGraduationGroup.handler";
import paginate from "express-paginate";

const graduationGroupRoutes = (router: Router) => {
  /**
   * Create a new graduation group
   */

  router.post(
    "/create",
    checkRole([Role.EMPLOYEE, Role.INSTUCTOR]),
    createGraduationGroupRequestBodyMiddleware,
    asyncHandler(CreateGraduationGroupHandler)
  );

  /**
   * Update a graduation group
   */

  router.patch(
    "/update/:groupId",
    checkRole([Role.INSTUCTOR, Role.EMPLOYEE, Role.ADMIN]),
    ensureGroupIdInParamsMiddleware,
    updateGraduationGroupRequestBodyMiddleware,
    asyncHandler(updateGraduationGroupHandler)
  );

  /**
   * Get the authenticated student's graduation group
   */

  router.get(
    "/mygroup",
    checkRole([Role.STUDENT]),
    asyncHandler(getMyGraduationGroupHandler)
  );

  /**
   * Get a graduation group by its group code
   */
  router.get(
    "/:groupId",
    checkRole([Role.INSTUCTOR, Role.EMPLOYEE, Role.ADMIN]),
    ensureGroupIdInParamsMiddleware,
    asyncHandler(getGraduationGroupByIdHandler)
  );

  /**
   * Get all graduation groups
   */

  router.get(
    "/",
    checkRole([Role.INSTUCTOR, Role.EMPLOYEE, Role.ADMIN]),
    paginate.middleware(),
    asyncHandler(getAllGraduationGroupsHandler)
  );

  router.delete(
    "/:groupId",
    checkRole([Role.EMPLOYEE, Role.ADMIN]),
    ensureGroupIdInParamsMiddleware,
    asyncHandler(deleteGraduationGroupHandler)
  );
};

export default graduationGroupRoutes;
