import { ERROR_CODES } from "coral-common/errors";
import { CoralError } from "coral-server/errors";

/**
 * mapFieldsetToErrorCodes will wait for any errors to occur with the request,
 * and then associate the appropriate field that caused the error to the error
 * itself so it can link context in the UI.
 *
 * @param promise the promise to await on for any errors to occur
 * @param errorMap the map of error codes to associate with a given fieldSet
 */
export async function mapFieldsetToErrorCodes<T>(
  promise: Promise<T>,
  errorMap: Record<string, ERROR_CODES[]>
): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    // If the error is a CoralError...
    if (err instanceof CoralError) {
      // Then loop over all the fieldSpecs...
      for (const param in errorMap) {
        if (!Object.prototype.hasOwnProperty.call(errorMap, param)) {
          continue;
        }

        if (errorMap[param].some((code) => err.code === code)) {
          err.param = param;
          break;
        }
      }
    }

    throw err;
  }
}
