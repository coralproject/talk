import { RequestHandler } from "express";

export const healthHandler: RequestHandler = (req, res, next) => {
  res.sendStatus(200);
};
