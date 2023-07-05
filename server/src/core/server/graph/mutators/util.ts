/**
 * validateMaximumLength will limit the value of an optional string to the
 * specified amount, otherwise will throw an error.
 *
 * @param maxLength maximum length to limit a value to
 * @param value the value that should be limited
 */
export function validateMaximumLength(maxLength: number, value?: string) {
  if (value && value.length > maxLength) {
    throw new Error(`Exceeded maximum length of ${maxLength} characters`);
  }

  return value;
}

export type WithoutMutationID<T extends { clientMutationId: string }> = Omit<
  T,
  "clientMutationId"
>;
