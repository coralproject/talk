import { ERROR_CODES } from "coral-common/errors";

const triggers = [
  ERROR_CODES.USER_BANNED,
  ERROR_CODES.USER_SUSPENDED,
  ERROR_CODES.USER_WARNED,
];

/**
 * shouldTriggerSettingsRefresh will indicate whether the settings
 * needs to refresh based on a recently received error code. Some
 * error codes signify that the settings on the client currently
 * mismatches with the newest settings on the server, and thus
 * e.g. validations fail.
 *
 * @param code the error code to check for
 */
export default function shouldTriggerViewerRefresh(code: ERROR_CODES) {
  return triggers.includes(code);
}
