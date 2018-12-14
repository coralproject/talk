import { parseQuery } from "talk-common/utils";

export default function parseQueryHash(hash: string): Record<string, string> {
  let normalized = hash;
  if (normalized[0] === "#") {
    normalized = normalized.substr(1);
  }
  return parseQuery(normalized);
}
