import { Request, Response } from "express";
import GraduationProjectTeamModel from "../../data/models/graduationteam.model";

type HandlerRequest = Request<
  {
    groupId: string;
  },
  {},
  {}
>;

/**
 * Gets a graduation group by its group ID
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { groupId } = req.params;

  const graduationGroup = await GraduationProjectTeamModel.findOne({ groupId });

  if (!graduationGroup) {
    return res.status(404).json({
      message: "Graduation group not found",
    });
  }

  return res.status(200).json(graduationGroup);
};

const getGraduationGroupHandler = handler;

export default getGraduationGroupHandler;
