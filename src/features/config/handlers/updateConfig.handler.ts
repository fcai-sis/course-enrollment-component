import { DynamicConfigType, dynamicConfigModel } from "@fcai-sis/shared-models";
import env from "../../../env";
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
      errors: [
        {
          message: "Failed to update configuration settings",
        },
      ],
    });
  }

  if (updatedConfig.isCourseEnrollOpen) {
    await fetch(`${env.MAIL_API_URL}/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: "Course enrollment is now open",
        text: "You can now enroll in courses for the upcoming semester!",
      }),
    });
  }

  if (updatedConfig.isDepartmentEnrollOpen) {
    await fetch(`${env.MAIL_API_URL}/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: "Department enrollment is now open",
        text: "You can now submit your department preferences for the upcoming semester!",
      }),
    });
  }

  if (updatedConfig.isGradProjectRegisterOpen) {
    await fetch(`${env.MAIL_API_URL}/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: "Graduation project registration is now open",
        text: "You can now register for your graduation project.",
      }),
    });
  }
  const response = {
    message: "Configuration settings updated successfully",
    ...updatedConfig.toObject(),
  };

  res.status(200).json(response);
};

export default updateConfigSettingsHandler;
