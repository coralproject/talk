import { RequestHandler } from "express";

export const healthHandler: RequestHandler = (req, res, next) => {
  res.status(200).send("OK");
};
