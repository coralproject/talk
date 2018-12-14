import * as qs from "talk-common/utils/queryStringify";

import buildURL from "./buildURL";
import parseURL from "./parseURL";

export default function modifyQuery(url: string, params: {}) {
  const parsed = parseURL(url);
  const query = qs.parse(parsed.search);
  parsed.search = qs.stringify({ ...query, ...params });
  return buildURL(parsed);
}
