import { Request, Response } from "express";
import GraduationProjectTeamModel from "../../data/models/graduationteam.model";

/**
 * Gets all graduation groups
 */
const handler = async (req: Request, res: Response) => {
  const graduationGroups = await GraduationProjectTeamModel.find(
    {},
    {
      __v: 0,
    },
    {
      skip: req.skip,
      limit: req.query.limit as unknown as number,
    }
  );

  if (!graduationGroups) {
    return res.status(404).json({
      message: "There are no graduation groups at the moment",
    });
  }

  const totalGraduationGroups =
    await GraduationProjectTeamModel.countDocuments();
  const response = {
    graduationGroups,
    totalGraduationGroups,
  };

  return res.status(200).json(response);
};

const getAllGraduationGroupsHandler = handler;

export default getAllGraduationGroupsHandler;
