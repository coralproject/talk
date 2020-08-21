import axios, { Method } from "axios";
import http from "http";
import https from "https";
import { capitalize } from "lodash";

import { version } from "coral-common/version";

export type Axios = (
  url: string,
  options?: AxiosOptions,
  timeout?: number
) => Promise<AxiosResponse>;

export interface AxiosResponse {
  ok: boolean;
  status: number;
  data: any;
}

export interface CreateAxiosOptions {
  /**
   * name is the string that is attached to the `User-Agent` header as:
   *
   *  `Coral ${name}/${version}`
   */
  name: string;
}

export interface AxiosOptions {
  method: Method;
  headers: any;
  body: any;
}

export const createAxios = ({ name }: CreateAxiosOptions): Axios => {
  // defaultHeaders are the headers attached to each request (unless they are
  // overridden).
  const defaultHeaders = {
    "User-Agent": `Coral ${capitalize(name)}/${version}`,
  };

  // Create HTTP agents to improve connection performance.
  const agents = {
    https: new https.Agent({
      keepAlive: true,
    }),
    http: new http.Agent({
      keepAlive: true,
    }),
  };

  return async (
    url: string,
    { method = "GET", headers = {}, body = {} }: AxiosOptions,
    timeout?: number
  ) => {
    const response = await axios.request({
      method,
      url,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      data: body,
      timeout,
      timeoutErrorMessage: "axios request timed out",
      httpAgent: agents.http,
      httpsAgent: agents.https,
    });

    const ok = response.status >= 200 || response.status <= 299;

    return {
      ok,
      status: response.status,
      data: response.data,
    };
  };
};
