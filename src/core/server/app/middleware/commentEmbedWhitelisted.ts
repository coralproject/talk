import { AppOptions } from "coral-server/app";
import { retrieveComment } from "coral-server/models/comment";
import { retrieveSite } from "coral-server/models/site";
import { RequestHandler } from "coral-server/types/express";

import { getRequesterOrigin } from "../helpers";

export const commentEmbedWhitelisted =
  ({ mongo }: Pick<AppOptions, "mongo">): RequestHandler =>
  async (req, res, next) => {
    // First try to get the commentID from the query params
    let { commentID } = req.query;

    // For the Oembed endpoint, will need to get commentID from the url
    if (!commentID) {
      const urlToParse = new URL(req.query.url);
      commentID = urlToParse.searchParams.get("commentID");
    }

    const { tenant } = req.coral;

    if (commentID && tenant) {
      const comment = await retrieveComment(
        mongo.comments(),
        tenant.id,
        commentID
      );
      const siteID = comment?.siteID;
      if (siteID) {
        const site = await retrieveSite(mongo, tenant.id, siteID);
        if (site) {
          const origin = getRequesterOrigin(req);
          if (origin) {
            if (!site.allowedOrigins.includes(origin)) {
              res.sendStatus(401);
            }
          }
        }
      }
    }
    return next();
  };
