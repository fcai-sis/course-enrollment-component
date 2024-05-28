import { Router } from "express";

import enrollmentRoutes from "./features/enrollment/enrollment.routes";
import graduationGroupRoutes from "./features/graduation/graduationgroup.routes";

const router: Router = Router();

export const enrollmentRouter = () => {
  const router = Router();
  enrollmentRoutes(router);
  return router;
};

export const graduationGroupRouter = () => {
  const router = Router();
  graduationGroupRoutes(router);
  return router;
};
