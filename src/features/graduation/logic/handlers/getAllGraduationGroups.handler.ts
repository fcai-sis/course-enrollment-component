import { Request, Response } from "express";
import GraduationProjectTeamModel from "../../data/models/graduationteam.model";

/**
 * Gets all graduation groups
 */
const handler = async (req: Request, res: Response) => {
  const page = req.context.page;
  const pageSize = req.context.pageSize;

  const graduationGroups = await GraduationProjectTeamModel.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  if (!graduationGroups) {
    return res.status(404).json({
      message: "There are no graduation groups at the moment",
    });
  }

  const response = {
    graduationGroups,
    page,
    pageSize,
  };

  return res.status(200).json(response);
};

const getAllGraduationGroupsHandler = handler;

export default getAllGraduationGroupsHandler;
