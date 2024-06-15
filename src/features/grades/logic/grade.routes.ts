import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Router } from "express";
import addScoreHandler from "./handlers/addScore.handler";
import ensureEnrollmentIdInParamsMiddleware from "./middlewares/ensureEnrollmentIdInParams.middleware";
import addScoreRequestMiddleware from "./middlewares/addScoreRequest.middleware";
import updateScoreHandler from "./handlers/updateScore.handler";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import updateFinalExamScoreHandler from "./handlers/updateFinalExamScore.handler";
import updateFinalExamMiddleware from "./middlewares/updateFinalExamScore.middleware";

const gradeRoutes = (router: Router) => {
  /**
   * Add new scores to an existing grade
   */

  router.patch(
    "/addscore/:enrollmentId",
    checkRole([Role.INSTUCTOR, Role.ADMIN]),
    ensureEnrollmentIdInParamsMiddleware,
    addScoreRequestMiddleware,
    asyncHandler(addScoreHandler)
  );

  router.patch(
    "/updatescore/:enrollmentId",
    checkRole([Role.INSTUCTOR, Role.ADMIN]),
    ensureEnrollmentIdInParamsMiddleware,
    addScoreRequestMiddleware,
    asyncHandler(updateScoreHandler)
  );

  router.patch(
    "/updatefinal/:enrollmentId",
    checkRole([Role.INSTUCTOR, Role.ADMIN]),
    ensureEnrollmentIdInParamsMiddleware,
    updateFinalExamMiddleware,
    asyncHandler(updateFinalExamScoreHandler)
  );
};

export default gradeRoutes;
