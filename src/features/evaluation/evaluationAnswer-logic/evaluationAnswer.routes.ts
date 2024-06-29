import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import paginate from "express-paginate";
import submitEvaluationAnswersHandler from "./handlers/submitEvaluationAnswers.handler";

const evaluationAnswerRoutes = (router: Router) => {
  router.post(
    "/submit-answers",

    asyncHandler(submitEvaluationAnswersHandler),
  );
};

export default evaluationAnswerRoutes;

