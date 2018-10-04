import { RequestHandler } from "express";

export const adminHandler: RequestHandler = (req, res) => {
  res.render("admin");
};
