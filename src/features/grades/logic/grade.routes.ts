import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Router } from "express";
import ensureEnrollmentIdInParamsMiddleware from "./middlewares/ensureEnrollmentIdInParams.middleware";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import updateGradesHandler from "./handlers/updateGrades.handler";
import updateGradesRequestMiddleware from "./middlewares/updateGradesRequest.middleware";

const gradeRoutes = (router: Router) => {
  /**
   * Update grades of an existing enrollment
   */
  router.patch(
    "/update/:enrollmentId",
    checkRole([Role.INSTRUCTOR, Role.EMPLOYEE]),
    ensureEnrollmentIdInParamsMiddleware,
    updateGradesRequestMiddleware,
    asyncHandler(updateGradesHandler)
  );
};

export default gradeRoutes;
