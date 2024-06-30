import { dynamicConfigModel } from "@fcai-sis/shared-models";
import { Request, Response, NextFunction } from "express";

const checkEnrollConfigMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const config = await dynamicConfigModel.findOne();

  if (!config) {
    return res.status(500).json({
      error: {
        message: "No configuration found",
      },
    });
  }

  if (!config.isCourseEnrollOpen) {
    return res.status(403).json({
      error: {
        message: "Not allowed to enroll at this time",
      },
    });
  }

  next();
};

export default checkEnrollConfigMiddleware;
