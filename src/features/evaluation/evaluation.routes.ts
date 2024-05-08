import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createEvaluationQuestionValidatorMiddleware from "./evaluationQuestion-logic/middlewares/createEvaluationQuestionValidator.middleware";
import createEvaluationQuestionHandler from "./evaluationQuestion-logic/handlers/createEvaluationQuestion.handler";
import ensureEvaluationQuestionIdInParamsMiddleware from "./evaluationQuestion-logic/middlewares/ensureEvaluationQuestionIdInParams.middleware";
import deleteEvaluationQuestionHandler from "./evaluationQuestion-logic/handlers/deleteEvaluationQuestion.handler";
import validateTypeFieldMiddleware from "./evaluationQuestion-logic/middlewares/validateTypeField.middleware";
import getEvaluationQuestionsHandler from "./evaluationQuestion-logic/handlers/getEvaluationQuestions.handler";
import { paginationQueryParamsMiddleware } from "@fcai-sis/shared-middlewares";
import updateEvaluationQuestionValidatorMiddleware from "./evaluationQuestion-logic/middlewares/updateEvaluationQuestionValidator.middleware";
import updateEvaluationQuestionHandler from "./evaluationQuestion-logic/handlers/updateEvaluationQuestion.handler";

const evaluationRoutes = (router: Router) => {
  router.post(
    "/questions",

    createEvaluationQuestionValidatorMiddleware,

    asyncHandler(createEvaluationQuestionHandler)
  );

  router.delete(
    "/questions/:evaluationQuestionId",

    ensureEvaluationQuestionIdInParamsMiddleware,

    asyncHandler(deleteEvaluationQuestionHandler)
  );

  router.get(
    "/questions",

    validateTypeFieldMiddleware,

    asyncHandler(getEvaluationQuestionsHandler)
  );

  router.get(
    "/questions/read",

    validateTypeFieldMiddleware,
    paginationQueryParamsMiddleware,

    asyncHandler(getEvaluationQuestionsHandler)
  )

  router.patch(
    "/questions/:evaluationQuestionId",

    ensureEvaluationQuestionIdInParamsMiddleware,
    updateEvaluationQuestionValidatorMiddleware,

    asyncHandler(updateEvaluationQuestionHandler)
  );

};

export default evaluationRoutes;

