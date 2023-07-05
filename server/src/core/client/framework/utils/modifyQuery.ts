import { parseQuery, stringifyQuery } from "coral-common/utils";

import buildURL from "./buildURL";
import parseURL from "./parseURL";

export default function modifyQuery(url: string, params: {}) {
  const parsed = parseURL(url);
  const query = parseQuery(parsed.search);
  parsed.search = stringifyQuery({ ...query, ...params });
  return buildURL(parsed);
}
