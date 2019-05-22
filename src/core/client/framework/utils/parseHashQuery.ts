import { parseQuery } from "coral-common/utils";

export default function parseQueryHash(
  hash: string
): Record<string, string | undefined> {
  let normalized = hash;
  if (normalized[0] === "#") {
    normalized = normalized.substr(1);
  }
  return parseQuery(normalized);
}
