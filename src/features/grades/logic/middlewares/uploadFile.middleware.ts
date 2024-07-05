import multer from "multer";

import env from "../../../../env";

const fileFieldName = "file";

/**
 * Uploads a single file to the `FILE_UPLOAD_PATH` directory specified in the environment variables.
 */
const middleware = multer({ dest: env.FILE_UPLOAD_PATH }).single(fileFieldName);

export default middleware;
