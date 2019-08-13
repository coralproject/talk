import { revision, version } from "coral-common/version";
import { RequestHandler } from "express";

export const versionHandler: RequestHandler = (req, res, next) => {
  res.json({ version, revision, headers: req.headers, ip: req.ip });
};
