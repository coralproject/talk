import { RequestHandler } from "express";

import { revision, version } from "coral-common/version";

export const versionHandler: RequestHandler = (req, res, next) => {
  res.json({ version, revision });
};
