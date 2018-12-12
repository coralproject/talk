import { commitMutation } from "react-relay";
import { Environment, MutationConfig, OperationBase } from "relay-runtime";

import { Omit } from "talk-framework/types";

import extractPayload from "./extractPayload";

/**
 * Like `MutationConfig` but omits `onCompleted` and `onError`
 * because we are going to use a Promise API.
 */
export type MutationPromiseConfig<T extends OperationBase> = Omit<
  MutationConfig<T>,
  "onCompleted" | "onError"
>;

/**
 * Normalizes response and error from `commitMutationPromise`.
 * Meaning `response` will directly contain the payload
 * and errors are wrapped inside of application specific
 * error instances.
 */
export async function commitMutationPromiseNormalized<T extends OperationBase>(
  environment: Environment,
  config: MutationPromiseConfig<T>
): Promise<T["response"][keyof T["response"]]> {
  try {
    return await commitMutationPromise(environment, config);
  } catch (e) {
    throw e;
  }
}

/**
 * Like `commitMutation` of the Relay API but returns a Promise.
 */
export function commitMutationPromise<T extends OperationBase>(
  environment: Environment,
  config: MutationPromiseConfig<T>
): Promise<T["response"][keyof T["response"]]> {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      ...config,
      onCompleted: (response, errors) => {
        if (errors) {
          // This should not happen, as the network layer
          // will throw on errors which should result to
          // `onError` rather than `onCompleted``.
          reject(errors);
          return;
        }
        resolve(extractPayload(response));
      },
      onError: error => {
        reject(error);
      },
    });
  });
}
