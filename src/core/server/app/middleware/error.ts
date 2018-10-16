import { ErrorRequestHandler, Response } from "express";

import { HTTPErr, TalkErr } from "talk-server/errors";
import { Request } from "talk-server/types/express";

type Handler = (err: Error, req: Request, res: Response) => void;

const handler = (h: Handler): ErrorRequestHandler => (
  err,
  req: Request,
  res,
  next // ignored, but required for express.
) =>
  h(err, req, err instanceof HTTPErr ? res.status(err.code) : res.status(500));

export const apiErrorHandler: ErrorRequestHandler = handler((err, req, res) => {
  if (err instanceof TalkErr) {
    res.json({ error: { name: err.name, message: err.message } });
  } else {
    res.json({ error: err.message });
  }
});

export const errorHandler: ErrorRequestHandler = handler((err, req, res) =>
  res.send(err.message).end()
);
