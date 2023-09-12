import { CorsOptionsDelegate } from "cors";

import { MongoContext } from "coral-server/data/context";
import { retrieveComment } from "coral-server/models/comment";
import { retrieveSite } from "coral-server/models/site";
import { Request, RequestHandler } from "coral-server/types/express";

import { AppOptions } from "..";
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
          let origin: string | null | undefined = getRequesterOrigin(req);
          if (!origin) {
            origin = req.header("Origin");
          }
          if (origin) {
            //site.allowedOrigins.includes(origin)
            //if (true) {
              return next();
            //}
          }
        }
      }
    }
    res.sendStatus(401);
  };

/**
 * Creates the options for the "cors" middleware which whitelists
 * site origins for the single comment embed.
 *
 * @param mongo the database connection
 * @returns CorsOptionsDelegate
 */
export function createCommentEmbedCorsOptionsDelegate(
  mongo: MongoContext
): CorsOptionsDelegate {
  return async (req: Request, callback) => {
    //const originHeader = req.header("Origin");
    //const tenantID = req.coral.tenant?.id;
    // if (!originHeader || !tenantID) {
    //   callback(null, { origin: false }); // disable CORS for this request
    //   return;
    // }
    callback(null, { origin: true });
  };
}
