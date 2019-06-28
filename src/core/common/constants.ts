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
