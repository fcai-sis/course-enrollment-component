import { dynamicConfigModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

const getConfigSettingsHandler = async (req: Request, res: Response) => {
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

  const response = {
    config: {
      ...config.toObject(),
    },
  };

  res.status(200).json(response);
};

export default getConfigSettingsHandler;
