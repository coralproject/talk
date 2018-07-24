import { RequestHandler } from "express";

import { reconstructURL } from "talk-server/app/url";
import { Request } from "talk-server/types/express";

export const devHandler: RequestHandler = (req: Request, res, next) => {
  res.render("dev/article", {
    title: "Talk - Development",
    url: reconstructURL(req),
  });
};
