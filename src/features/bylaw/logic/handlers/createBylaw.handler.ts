import { Request, Response } from "express";
import { BylawModel } from "@fcai-sis/shared-models";

type HandlerRequest = Request<
  {},
  {},
  {
    name: string;
    gradeWeights: { [key: string]: { weight: number; percentage: { min: number; max: number } } };
    gpaScale: number;
    useDetailedHours: boolean;
    useDetailedGraduationProjectHours: boolean;
    levelRequirements: { [key: string]: { mandatoryHours: number; electiveHours: number; totalHours: number; maxYears: number } };
    graduationProjectRequirements: { [key: string]: { mandatoryHours: number; electiveHours: number; totalHours: number } };
    yearApplied: number;
  }
>;

/**
 * create bylaw handler
 */
const handler = async (req: HandlerRequest, res: Response) => {
  const { name, gradeWeights, gpaScale, useDetailedHours, useDetailedGraduationProjectHours, levelRequirements, graduationProjectRequirements, yearApplied } = req.body;

  // Create a new bylaw
  const newBylaw = new BylawModel({
    name,
    gradeWeights,
    gpaScale,
    useDetailedHours,
    useDetailedGraduationProjectHours,
    levelRequirements,
    graduationProjectRequirements,
    yearApplied,
  });

  await newBylaw.save();
  return res.status(200).json({
    message: "Bylaw created successfully",
  });
};

const createBylawHandler = handler;
export default createBylawHandler;
