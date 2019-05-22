import { Overwrite } from "coral-framework/types";
import { merge } from "lodash";

import { extractError } from "./network";

const buildOptions = (inputOptions: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  };
  const options = merge({}, defaultOptions, inputOptions);
  if (options.method!.toLowerCase() !== "get") {
    options.body = JSON.stringify(options.body);
  }
  return options;
};

// TODO (bc): Wrap response errors into error objects once server errors have been defined

const handleResp = async (res: Response) => {
  if (res.status === 404) {
    const response = await res.text();
    throw new Error(response);
  }

  if (!res.ok) {
    const ctype = res.headers.get("content-type");
    if (ctype && ctype.includes("application/json")) {
      const response = await res.json();
      throw extractError(response.error);
    } else {
      const response = await res.text();
      throw new Error(response);
    }
  }

  if (res.status === 204) {
    return res.text();
  }

  return res.json();
};

type PartialRequestInit = Overwrite<Partial<RequestInit>, { body?: any }> & {
  token?: string;
};

export class RestClient {
  public readonly uri: string;
  private tokenGetter?: () => string;

  constructor(uri: string, tokenGetter?: () => string) {
    this.uri = uri;
    this.tokenGetter = tokenGetter;
  }

  public async fetch<T = {}>(
    path: string,
    options: PartialRequestInit
  ): Promise<T> {
    let opts = options;
    const token = options.token || (this.tokenGetter && this.tokenGetter());
    if (token) {
      opts = merge({}, options, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    const response = await fetch(`${this.uri}${path}`, buildOptions(opts));
    return handleResp(response);
  }
}
