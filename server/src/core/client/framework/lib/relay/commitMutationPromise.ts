import { commitMutation } from "react-relay";
import { Environment, MutationConfig, MutationParameters } from "relay-runtime";

import extractPayload from "./extractPayload";
import { resolveModule } from "./helpers";

/**
 * Like `MutationConfig` but omits `onCompleted` and `onError`
 * because we are going to use a Promise API.
 */
export type MutationPromiseConfig<T extends MutationParameters> = Omit<
  MutationConfig<T>,
  "onCompleted" | "onError"
>;

/**
 * Normalizes response and error from `commitMutationPromise`.
 * Meaning `response` will directly contain the payload
 * and errors are wrapped inside of application specific
 * error instances.
 */
export async function commitMutationPromiseNormalized<
  T extends MutationParameters
>(
  environment: Environment,
  config: MutationPromiseConfig<T>
): Promise<T["response"][keyof T["response"]]> {
  return await commitMutationPromise(environment, config);
}

/**
 * Like `commitMutation` of the Relay API but returns a Promise.
 */
export function commitMutationPromise<T extends MutationParameters>(
  environment: Environment,
  config: MutationPromiseConfig<T>
): Promise<T["response"][keyof T["response"]]> {
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      ...config,
      mutation: resolveModule(config.mutation),
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
      onError: (error) => {
        reject(error);
      },
    });
  });
}
