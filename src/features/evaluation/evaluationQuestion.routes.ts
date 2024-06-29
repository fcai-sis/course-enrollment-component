import { Router } from "express";

import { asyncHandler } from "@fcai-sis/shared-utilities";
import createEvaluationQuestionValidatorMiddleware from "./evaluationQuestion-logic/middlewares/createEvaluationQuestionValidator.middleware";
import createEvaluationQuestionHandler from "./evaluationQuestion-logic/handlers/createEvaluationQuestion.handler";
import ensureEvaluationQuestionIdInParamsMiddleware from "./evaluationQuestion-logic/middlewares/ensureEvaluationQuestionIdInParams.middleware";
import deleteEvaluationQuestionHandler from "./evaluationQuestion-logic/handlers/deleteEvaluationQuestion.handler";
import validateTypeFieldMiddleware from "./evaluationQuestion-logic/middlewares/validateTypeField.middleware";
import getEvaluationQuestionsHandler from "./evaluationQuestion-logic/handlers/getEvaluationQuestions.handler";
import paginate from "express-paginate";
import updateEvaluationQuestionValidatorMiddleware from "./evaluationQuestion-logic/middlewares/updateEvaluationQuestionValidator.middleware";
import updateEvaluationQuestionHandler from "./evaluationQuestion-logic/handlers/updateEvaluationQuestion.handler";

const evaluationQuestionRoutes = (router: Router) => {
  router.post(
    "/",

    createEvaluationQuestionValidatorMiddleware,

    asyncHandler(createEvaluationQuestionHandler)
  );

  router.delete(
    "/:evaluationQuestionId",

    ensureEvaluationQuestionIdInParamsMiddleware,

    asyncHandler(deleteEvaluationQuestionHandler)
  );

  router.get(
    "/",

    validateTypeFieldMiddleware,

    asyncHandler(getEvaluationQuestionsHandler)
  );

  router.get(
    "/read",

    validateTypeFieldMiddleware,
    paginate.middleware(),

    asyncHandler(getEvaluationQuestionsHandler)
  );

  router.patch(
    "/:evaluationQuestionId",

    ensureEvaluationQuestionIdInParamsMiddleware,
    updateEvaluationQuestionValidatorMiddleware,

    asyncHandler(updateEvaluationQuestionHandler)
  );
};

export default evaluationQuestionRoutes;
