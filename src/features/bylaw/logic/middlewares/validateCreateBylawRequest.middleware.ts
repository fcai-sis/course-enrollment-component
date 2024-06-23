import * as validator from "express-validator";
import { Request, Response, NextFunction } from "express";
import logger from "../../../../core/logger";

/*
 * Middleware to validate the request body for creating a bylaw
 *
 **/
const validateCreateBylawRequestMiddleware = [
  validator
    .body("name")
    .exists()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  validator
    .body("useDetailedHours")
    .exists()
    .withMessage("useDetailedHours is required")
    .isBoolean()
    .withMessage("useDetailedHours must be a boolean"),
  validator
    .body("useDetailedGraduationProjectHours")
    .exists()
    .withMessage("useDetailedGraduationProjectHours is required")
    .isBoolean()
    .withMessage("useDetailedGraduationProjectHours must be a boolean"),
  validator
    .body("gradeWeights")
    .exists()
    .withMessage("gradeWeights is required")
    .isObject()
    .withMessage("gradeWeights must be an object"),
  validator
    .body("gradeWeights.*.weight")
    .isNumeric()
    .withMessage("Grade weights must be numeric"),
  validator
    .body("gradeWeights.*.percentage.min")
    .isInt({ min: 0, max: 100 })
    .withMessage("Percentage must be between 0 and 100"),
  validator
    .body("gradeWeights.*.percentage.max")
    .isInt({ min: 0, max: 100 })
    .withMessage("Percentage must be between 0 and 100"),
  validator
    .body("gpaScale")
    .exists()
    .withMessage("gpaScale is required")
    .isNumeric()
    .withMessage("gpaScale must be a number"),
  validator
    .body("levelRequirements")
    .exists()
    .withMessage("levelRequirements is required")
    .isObject()
    .withMessage("levelRequirements must be an object"),
  validator
    .body("graduationProjectRequirements")
    .exists()
    .withMessage("graduationProjectRequirements is required")
    .isObject()
    .withMessage("graduationProjectRequirements must be an object"),
  validator
    .body("yearApplied")
    .exists()
    .withMessage("yearApplied is required")
    .isNumeric()
    .withMessage("yearApplied must be a number"),

  // Custom validations based on useDetailedHours
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.useDetailedHours) {
      validator
        .body("levelRequirements.*.mandatoryHours")
        .exists()
        .withMessage("mandatoryHours is required when useDetailedHours is true")
        .isInt({ min: 0 })
        .withMessage("mandatoryHours must be greater than or equal to 0")
        .run(req);
      validator
        .body("levelRequirements.*.electiveHours")
        .exists()
        .withMessage("electiveHours is required when useDetailedHours is true")
        .isInt({ min: 0 })
        .withMessage("electiveHours must be greater than or equal to 0")
        .run(req);
    } else {
      validator
        .body("levelRequirements.*.totalHours")
        .exists()
        .withMessage("totalHours is required when useDetailedHours is false")
        .isInt({ min: 0 })
        .withMessage("totalHours must be greater than or equal to 0")
        .run(req);
    }

    if (req.body.useDetailedGraduationProjectHours) {
      validator
        .body("graduationProjectRequirements.*.mandatoryHours")
        .exists()
        .withMessage(
          "mandatoryHours is required when useDetailedGraduationProjectHours is true"
        )
        .isInt({ min: 0 })
        .withMessage("mandatoryHours must be greater than or equal to 0")
        .run(req);
      validator
        .body("graduationProjectRequirements.*.electiveHours")
        .exists()
        .withMessage(
          "electiveHours is required when useDetailedGraduationProjectHours is true"
        )
        .isInt({ min: 0 })
        .withMessage("electiveHours must be greater than or equal to 0")
        .run(req);
    } else {
      validator
        .body("graduationProjectRequirements.*.totalHours")
        .exists()
        .withMessage(
          "totalHours is required when useDetailedGraduationProjectHours is false"
        )
        .isInt({ min: 0 })
        .withMessage("totalHours must be greater than or equal to 0")
        .run(req);
    }
    next();
  },

  (req: Request, res: Response, next: NextFunction) => {
    logger.debug(
      `Validating create bylaw req body: ${JSON.stringify(req.body)}`
    );
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      logger.debug(
        `Validation failed for create bylaw req body: ${JSON.stringify(
          req.body
        )}`
      );

      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    next();
  },
];

export default validateCreateBylawRequestMiddleware;
