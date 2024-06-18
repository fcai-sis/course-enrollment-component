import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Router } from "express";
import {
  Role,
  checkRole,
  paginationQueryParamsMiddleware,
} from "@fcai-sis/shared-middlewares";
import createBylawHandler from "./logic/handlers/createBylaw.handler";
import validateCreateBylawRequestMiddleware from "./logic/middlewares/validateCreateBylawRequest.middleware";

const bylawRoutes = (router: Router) => {
  /**
   * Create a new bylaw
   */

  router.post(
    "/create",

    validateCreateBylawRequestMiddleware,

    asyncHandler(createBylawHandler)
  );

  // test route
  router.get("/test", (req, res) => {
    res.status(200).json({ message: "Bylaw routes working" });
  });
}

export default bylawRoutes;