/**
 * Maps an array of errors, null, and values to an array of null and values
 * where the errors are mapped to null.
 *
 * @param values values that could contain errors
 */
export function mapErrorsToNull<T>(
  values: Array<T | Error | null>
): Array<T | null> {
  return values.map((value) => {
    if (value instanceof Error) {
      return null;
    }

    return value;
  });
}
