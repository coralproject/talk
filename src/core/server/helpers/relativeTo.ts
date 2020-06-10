import { URL } from "url";

function relativeTo(input: string, base: string): string {
  return new URL(input.startsWith("/") ? input.slice(1) : input, base).href;
}

export default relativeTo;
