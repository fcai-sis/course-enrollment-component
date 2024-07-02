import { SemesterModel } from "@fcai-sis/shared-models";
import { Request, Response, NextFunction } from "express";

const getLatestSemesterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const latestSemester = await SemesterModel.findOne({}).sort({
    createdAt: -1,
  });

  if (!latestSemester)
    return res.status(404).json({ errors: [{ message: "no semester found" }] });

  req.body.semester = latestSemester._id;

  next();
};

export default getLatestSemesterMiddleware;
