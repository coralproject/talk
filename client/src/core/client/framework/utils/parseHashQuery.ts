import { parseQuery } from "coral-common/common/lib/utils";
import startsWith from "coral-common/common/lib/utils/startsWith";

export default function parseQueryHash(
  hash: string
): Record<string, string | undefined> {
  let normalized = hash;
  if (startsWith(normalized, "#")) {
    normalized = normalized.substr(1);
  }
  return parseQuery(normalized);
}
