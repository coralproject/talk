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

/**
 * SCHEDULED_DELETION_TIMESPAN_DAYS is the length of time in days a user
 * will have to wait for their account to be deleted after requesting a
 * deletion.
 */
export const SCHEDULED_DELETION_TIMESPAN_DAYS = 14;

/**
 * COMMENT_LIMIT_WINDOW_SECONDS is the number of seconds that a user has to
 * wait in-between writing comments.
 */
export const COMMENT_LIMIT_WINDOW_SECONDS = 3;

/**
 * DEFAULT_SESSION_LENTTH is the length of time in seconds a session is valid for unless configured in tenant.
 */
export const DEFAULT_SESSION_LENGTH = 7776000;

/**
 * COMMENT_REPEAT_POST_TIMESPAN is the length of time in seconds that a previous comment ID is stored for a
 * user to prevent them from posting the same comment repeatedly.
 */
export const COMMENT_REPEAT_POST_TIMESPAN = 21600;
