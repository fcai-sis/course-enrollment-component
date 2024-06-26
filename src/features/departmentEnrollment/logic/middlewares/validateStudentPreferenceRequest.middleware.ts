import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import { DepartmentModel } from "@fcai-sis/shared-models";

const validateStudentPreferenceRequestMiddleware = [
  validator
    .body("preferences")
    .exists()
    .withMessage("Department preferences are required")
    .isArray()
    .withMessage(
      "Department preferences must be an array of department IDs"
    )
    .custom(async (preferences: string[]) => {
      // make sure the array length is the same as the length of all departments in the database
      const departments = await DepartmentModel.find({
        program: "GENERAL",
      });

      if (departments.length !== preferences.length) {
        throw new Error("One or more department IDs are invalid or missing");
      }

      return true;
    }),
  validator
    .body("preferences.*")
    .isMongoId()
    .withMessage("Each department ID must be a valid MongoDB ID"),

  validateRequestMiddleware,
];

export default validateStudentPreferenceRequestMiddleware;
