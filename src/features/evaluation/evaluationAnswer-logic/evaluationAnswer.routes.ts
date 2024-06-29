import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import paginate from "express-paginate";
import submitEvaluationAnswersHandler from "./handlers/submitEvaluationAnswers.handler";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";

const evaluationAnswerRoutes = (router: Router) => {
  router.post(
    "/submit-answers",
    checkRole([Role.STUDENT]),
    asyncHandler(submitEvaluationAnswersHandler),
  );
};

export default evaluationAnswerRoutes;

