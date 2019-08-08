/**
 * CLIENT_ID_HEADER references the name of the header used to extract/send the
 * client ID to enable automatic de-duplication.
 */
export const CLIENT_ID_HEADER = "X-Coral-Client-ID";

/**
 * CLIENT_ID_PARAM references the name of the param used to send the client ID
 * via connectionParams when authenticating a websocket connection to enable
 * automatic de-duplication.
 */
export const CLIENT_ID_PARAM = "clientID";

/**
 * ACCESS_TOKEN_PARAM references the name of the param used to send the access
 * token in connectionParams when authenticating a websocket connection.
 */
export const ACCESS_TOKEN_PARAM = "accessToken";

/**
 * TOXICITY_THRESHOLD_DEFAULT is the default value used when the threshold is
 * not set.
 */
export const TOXICITY_THRESHOLD_DEFAULT = 80;

/**
 * TOXICITY_MODEL_DEFAULT is the default value used for the toxicity model.
 */
export const TOXICITY_MODEL_DEFAULT = "TOXICITY";

/**
 * TOXICITY_ENDPOINT_DEFAULT is the default value used for the toxicity endpoint
 * for the API.
 */
export const TOXICITY_ENDPOINT_DEFAULT =
  "https://commentanalyzer.googleapis.com/v1alpha1";

/**
 * DOWNLOAD_LIMIT_TIMEFRAME is the number of seconds that a given download may
 * be made within.
 */
export const DOWNLOAD_LIMIT_TIMEFRAME = 14 * 86400;

/**
 * ALLOWED_USERNAME_CHANGE_FREQUENCY is the length of time in seconds a user must wait after changing their username to change it again.
 */
export const ALLOWED_USERNAME_CHANGE_FREQUENCY = 14 * 86400;
