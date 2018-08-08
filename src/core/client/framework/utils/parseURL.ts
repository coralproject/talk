import { pick } from "lodash";

export default function parseURL(url: string) {
  const parser = document.createElement("a");
  parser.href = url;
  return pick(parser, [
    "protocol",
    "hostname",
    "port",
    "pathname",
    "search",
    "hash",
  ]);
}
