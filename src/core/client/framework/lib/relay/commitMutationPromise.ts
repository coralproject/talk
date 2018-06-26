import { commitMutation } from "react-relay";
import { Environment, MutationConfig } from "relay-runtime";

import { Omit } from "talk-framework/types";

import { BadUserInputError, UnknownServerError } from "../errors";

/**
 * Like `MutationConfig` but omits `onCompleted` and `onError`
 * because we are going to use a Promise API.
 */
export type MutationPromiseConfig<T, U> = Omit<
  MutationConfig<T, U>,
  "onCompleted" | "onError"
>;

// Extract the payload from the response,
function getPayload(response: { [key: string]: any }): any {
  const keys = Object.keys(response);
  if (keys.length !== 1) {
    return response;
  }
  return response[keys[0]];
}

// Extract the payload from the response,
// hide the clientMutationId detail.
function getError(error: Error | Error[]): Error {
  let e = error;
  if (Array.isArray(e)) {
    if (e.length > 1) {
      // tslint:disable-next-line: no-console
      console.error(`Unexpected Error array length, should be 1`, error);
    }
    e = e[0];
  }

  let err = e as Error;
  if ((err as any).extensions) {
    if ((err as any).code === "BAD_USER_INPUT") {
      err = new BadUserInputError((err as any).extensions);
    } else {
      err = new UnknownServerError(err.message, (err as any).extensions);
    }
  }
  return err;
}

/**
 * Normalizes response and error from `commitMutationPromise`.
 * Meaning `response` will directly contain the payload
 * and errors are wrapped inside of application specific
 * error instances.
 */
export async function commitMutationPromiseNormalized<R, V>(
  environment: Environment,
  config: MutationPromiseConfig<R, V>
): Promise<R> {
  try {
    const response = await commitMutationPromise(environment, config);
    return getPayload(response);
  } catch (e) {
    throw getError(e);
  }
}

/**
 * Like `commitMutation` of the Relay API but returns a Promise.
 */
export function commitMutationPromise<R, V>(
  environment: Environment,
  config: MutationPromiseConfig<R, V>
): Promise<R> {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      ...config,
      onCompleted: (response, errors) => {
        if (errors) {
          reject(errors);
          return;
        }
        resolve(getPayload(response));
      },
      onError: error => {
        reject(error);
      },
    });
  });
}
