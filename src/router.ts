import { Router } from "express";

import enrollmentRoutes from "./features/enrollment/enrollment.routes";

const router: Router = Router();

export default (): Router => {
  enrollmentRoutes(router);

  return router;
};
