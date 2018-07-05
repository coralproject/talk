import { Request } from "talk-server/types/express";
import { URL } from "url";

export function reconstructURL(req: Request, path: string = "/"): string {
  const scheme = req.secure ? "https" : "http";
  const host = req.get("host");
  const base = `${scheme}://${host}`;

  const url = new URL(path, base);

  return url.href;
}
