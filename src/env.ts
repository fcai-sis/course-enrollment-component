export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOGS_PATH: process.env.LOGS_PATH,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  MAIL_API_URL: process.env.MAIL_API_URL,
  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
};

export const isDev = env.NODE_ENV === "development";

export const validateEnvironmentVariables = () => {
  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      // Warn the user that the environment variable is not set
      console.warn(`Environment variable ${key} is not set!`);
    }
  });
};

export default env;
