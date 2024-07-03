import { dynamicConfigModel } from "@fcai-sis/shared-models";
import { Request, Response, NextFunction } from "express";

const checkDepartmentEnrollConfigMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const config = await dynamicConfigModel.findOne();

  if (!config) {
    return res.status(500).json({
      errors: [
        {
          message: "No configuration found",
        },
      ],
    });
  }

  if (!config.isDepartmentEnrollOpen) {
    return res.status(403).json({
      errors: [
        {
          message: "Not allowed to enroll into departments at this time",
        },
      ],
    });
  }

  next();
};

export default checkDepartmentEnrollConfigMiddleware;
