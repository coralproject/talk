import { parseQuery } from "coral-common/utils";
import startsWith from "coral-common/utils/startsWith";

export default function parseQueryHash(
  hash: string
): Record<string, string | undefined> {
  let normalized = hash;
  if (startsWith(normalized, "#")) {
    normalized = normalized.substr(1);
  }
  return parseQuery(normalized);
}
