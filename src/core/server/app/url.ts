import { Request } from "talk-server/types/express";
import { URL } from "url";

export function reconstructURL(req: Request, input?: string): string {
  const scheme = req.secure ? "https" : "http";
  const host = req.get("host");
  const base = `${scheme}://${host}`;
  const path = input || req.originalUrl;

  const url = new URL(path, base);

  return url.href;
}
