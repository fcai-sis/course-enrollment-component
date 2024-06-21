import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Router } from "express";
import createBylawHandler from "./logic/handlers/createBylaw.handler";
import validateCreateBylawRequestMiddleware from "./logic/middlewares/validateCreateBylawRequest.middleware";

const bylawRoutes = (router: Router) => {
  // Create bylaw
  router.post(
    "/create",

    validateCreateBylawRequestMiddleware,

    asyncHandler(createBylawHandler)
  );
};

export default bylawRoutes;
