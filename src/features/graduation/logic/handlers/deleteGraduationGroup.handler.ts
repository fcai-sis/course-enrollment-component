import { Request, Response } from "express";
import { GraduationProjectTeamModel } from "../../data/models/graduationteam.model";

type HandlerRequest = Request<
  {
    groupId: string;
  },
  {},
  {}
>;

/**
 * Deletes a graduation group by its group ID
 * */

const handler = async (req: HandlerRequest, res: Response) => {
  const { groupId } = req.params;

  const graduationGroup = await GraduationProjectTeamModel.findByIdAndDelete(
    groupId
  );

  if (!graduationGroup) {
    return res.status(404).json({
      errors: [
        {
          message: "Graduation group not found",
        },
      ],
    });
  }

  const response = {
    message: "Graduation group deleted successfully",
    graduationGroup,
  };

  return res.status(200).json(response);
};

const deleteGraduationGroupHandler = handler;

export default deleteGraduationGroupHandler;
