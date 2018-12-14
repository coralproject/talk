import * as qs from "talk-common/utils/queryStringify";

export default function parseQueryHash(hash: string): Record<string, string> {
  let normalized = hash;
  if (normalized[0] === "#") {
    normalized = normalized.substr(1);
  }
  return qs.parse(normalized);
}
