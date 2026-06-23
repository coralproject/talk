import { capitalize } from "lodash";
import { clearLongTimeout } from "long-settimeout";

import { version } from "coral-common/common/lib/version";
import {
  generateSignatures,
  SigningSecret,
} from "coral-server/models/settings";

import abortAfter from "./abortAfter";

export type Fetch = (url: string, options?: FetchOptions) => Promise<Response>;

export type FetchOptions = RequestInit & {
  /**
   * timeout is the number of seconds that the request will wait for a response
   * before timing out.
   */
  timeout?: number;
};

export interface CreateFetchOptions {
  /**
   * name is the string that is attached to the `User-Agent` header as:
   *
   *  `Coral ${name}/${version}`
   */
  name: string;

  /**
   * options to provide defaults for requests made using this fetcher.
   */
  options?: Omit<FetchOptions, "agent" | "body" | "signal">;
}

export function generateFetchOptions(
  signingSecrets: SigningSecret[],
  data: object,
  now: Date
): FetchOptions {
  // Serialize the body and signature to include in the request.
  const body = JSON.stringify(data, null, 2);
  const signature = generateSignatures(signingSecrets, body, now);

  const headers: Record<string, any> = {
    "Content-Type": "application/json",
    "X-Coral-Signature": signature,
  };

  return {
    method: "POST",
    headers,
    body,
  };
}

export const createFetch = ({
  name,
  options: { headers: defaultBaseHeaders = {}, ...defaultOptions } = {},
}: CreateFetchOptions): Fetch => {
  // defaultHeaders are the headers attached to each request (unless they are
  // overridden).
  const defaultHeaders = {
    "User-Agent": `Coral ${capitalize(name)}/${version}`,
    ...defaultBaseHeaders,
  };

  // Return the actual fetcher that just uses fetch under the hood.
  return async (
    url: string,
    {
      headers = {},
      // Default to 10 seconds for the timeout.
      timeout = 10000,
      ...options
    }: FetchOptions = {}
  ) => {
    // Abort the scrape request after the timeout is reached.
    const abort = abortAfter(timeout);

    try {
      // Perform the actual fetch operation.
      const res = await fetch(url, {
        headers: {
          ...defaultHeaders,
          ...headers,
        },
        // Do not follow redirects automatically, and do not error if we
        // encounter one. We'll treat the response from the request as the
        // endpoints final response.
        redirect: "manual",
        // Attach the controller signal to abort the request after the timeout
        // is reached.
        signal: abort.controller.signal as any,
        // Merge in the passed options.
        ...defaultOptions,
        ...options,
      });

      return res;
    } finally {
      clearLongTimeout(abort.timeout);
    }
  };
};
