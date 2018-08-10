import { RequestHandler } from "express";

export const streamHandler: RequestHandler = (req, res) => {
  res.render("stream");
};
