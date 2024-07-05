import { asyncHandler } from "@fcai-sis/shared-utilities";
import { Router } from "express";
import ensureEnrollmentIdInParamsMiddleware from "./middlewares/ensureEnrollmentIdInParams.middleware";
import { Role, checkRole } from "@fcai-sis/shared-middlewares";
import updateGradesHandler from "./handlers/updateGrades.handler";
import uploadFileMiddleware from "./middlewares/uploadFile.middleware";
import updateGradesRequestMiddleware from "./middlewares/updateGradesRequest.middleware";
import downloadGradingTemplateHandler from "./handlers/downloadGradingTemplate.handler";
import ensureFileUploadedMiddleware from "./middlewares/ensureFileUploaded.middleware";
import ensureFileIsExcelMiddleware from "./middlewares/ensureFileIsExcel.middleware";
import readStudentsFromExcelMiddlerware from "./middlewares/readStudentsFromExcel.middleware";
import batchUpdateGradesHandler from "./handlers/batchUpdateGrades.handler";

const gradeRoutes = (router: Router) => {
  /**
   * Update grades of an existing enrollment
   */
  router.patch(
    "/update/:enrollmentId",
    checkRole([Role.INSTRUCTOR, Role.EMPLOYEE]),
    ensureEnrollmentIdInParamsMiddleware,
    updateGradesRequestMiddleware,
    asyncHandler(updateGradesHandler)
  );

  router.post(
    "/batch-update",
    
    uploadFileMiddleware,
    ensureFileUploadedMiddleware,
    asyncHandler(ensureFileIsExcelMiddleware),

    asyncHandler(readStudentsFromExcelMiddlerware),

    asyncHandler(batchUpdateGradesHandler)
  );

  /**
   * Download grading template
   */
  router.get('/download-template',
    downloadGradingTemplateHandler
  );
};

export default gradeRoutes;
