import * as validator from "express-validator";
import { validateRequestMiddleware } from "@fcai-sis/shared-middlewares";
import { DepartmentModel, ProgramEnum } from "@fcai-sis/shared-models";

const validateStudentPreferenceRequestMiddleware = [
  validator
    .body("preferences")
    .exists()
    .withMessage("Department preferences are required")
    .isArray()
    .withMessage("Department preferences must be an array of department codes")
    .custom(async (preferences: string[]) => {
      // make sure the array length is the same as the length of all departments in the database
      const departments = await DepartmentModel.find({
        program: ProgramEnum[0],
      });

      if (departments.length !== preferences.length) {
        throw new Error("One or more departments are invalid or missing");
      }

      return true;
    }),
  validator
    .body("preferences.*")
    .isString()
    .withMessage("Each department code must be a string"),

  validateRequestMiddleware,
];

export default validateStudentPreferenceRequestMiddleware;
