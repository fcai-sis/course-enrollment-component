import { DynamicConfigType, dynamicConfigModel } from "@fcai-sis/shared-models";
import { Request, Response } from "express";

type HandlerRequest = Request<
  {},
  {},
  {
    config: Partial<DynamicConfigType>;
  }
>;

const updateConfigSettingsHandler = async (
  req: HandlerRequest,
  res: Response
) => {
  const { config } = req.body;

  const updatedConfig = await dynamicConfigModel.findOneAndUpdate(
    {},
    {
      ...config,
    },
    { new: true, runValidators: true }
  );

  if (!updatedConfig) {
    return res.status(500).json({
      error: {
        message: "Failed to update configuration settings",
      },
    });
  }

  const response = {
    message: "Configuration settings updated successfully",
    ...updatedConfig.toObject(),
  };

  res.status(200).json(response);
};

export default updateConfigSettingsHandler;
