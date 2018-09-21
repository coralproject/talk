import qs from "query-string";

export default function parseQueryHash(hash: string): Record<string, string> {
  return qs.parse(hash);
}
