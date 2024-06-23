import { Router } from "express";

import enrollmentRoutes from "./features/enrollment/enrollment.routes";
import graduationGroupRoutes from "./features/graduation/graduationgroup.routes";
import gradeRoutes from "./features/grades/logic/grade.routes";
import bylawRoutes from "./features/bylaw/bylaw.routes";
import evaluationQuestionRoutes from "./features/evaluation/evaluation.routes";
import studentPreferenceRoutes from "./features/departmentEnrollment/studentPreference.routes";

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

export const gradeRouter = () => {
  const router = Router();
  gradeRoutes(router);
  return router;
};

export const bylawRouter = () => {
  const router = Router();
  bylawRoutes(router);
  return router;
};

export const evaluationQuestionRouter = () => {
  const router = Router();
  evaluationQuestionRoutes(router);
  return router;
};

export const studentPreferenceRouter = () => {
  const router = Router();
  studentPreferenceRoutes(router);
  return router;
};
