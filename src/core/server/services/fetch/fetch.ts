import http from "http";
import https from "https";
import { capitalize } from "lodash";
import fetch, { RequestInit, Response } from "node-fetch";
import { URL } from "url";

import { version } from "coral-common/version";

import abortAfter from "./abortAfter";

export type Fetch = (url: string, options?: FetchOptions) => Promise<Response>;

export interface CreateFetchOptions {
  /**
   * name is the string that is attached to the `User-Agent` header as:
   *
   *  `Coral ${name}/${version}`
   */
  name: string;
}

export type FetchOptions = RequestInit & {
  /**
   * timeout is the number of seconds that the request will wait for a response
   * before timing out.
   */
  timeout?: number;
};

export const createFetch = ({ name }: CreateFetchOptions): Fetch => {
  // Create HTTP agents to improve connection performance.
  const agents = {
    https: new https.Agent({
      keepAlive: true,
    }),
    http: new http.Agent({
      keepAlive: true,
    }),
  };

  // agent will select the correct agent to use for reusing the agent.
  const agent = (url: URL) =>
    url.protocol === "http:" ? agents.http : agents.https;

  // defaultHeaders are the headers attached to each request (unless they are
  // overridden).
  const defaultHeaders = {
    "User-Agent": `Coral ${capitalize(name)}/${version}`,
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
        agent,
        headers: {
          ...defaultHeaders,
          ...headers,
        },
        // Attach the controller signal to abort the request after the timeout
        // is reached.
        signal: abort.controller.signal,
        // Merge in the passed options.
        ...options,
      });

      return res;
    } finally {
      clearTimeout(abort.timeout);
    }
  };
};
