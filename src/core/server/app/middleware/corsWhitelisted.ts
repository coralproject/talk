import cors, { CorsOptionsDelegate } from "cors";

import { MongoContext } from "coral-server/data/context";
import { retrieveSiteByOrigin } from "coral-server/models/site";
import { Request } from "coral-server/types/express";

/**
 * Creates the options for the "cors" middleware which whitelists
 * site origins.
 *
 * @param mongo the database connection
 * @returns CorsOptionsDelegate
 */
export function createCorsOptionsDelegate(
  mongo: MongoContext
): CorsOptionsDelegate {
  return async (req: Request, callback) => {
    const originHeader = req.header("Origin");
    const tenantID = req.coral.tenant?.id;
    if (!originHeader || !tenantID) {
      callback(null, { origin: false }); // disable CORS for this request
      return;
    }
    let allow = false;
    let err: Error | null = null;
    try {
      allow = Boolean(
        await retrieveSiteByOrigin(mongo, tenantID, originHeader)
      );
    } catch (e) {
      err = e;
    }
    callback(err, { origin: allow });
  };
}

/**
 * corsWhitelisted is a middleware that provides cors with whitelisted site origins.
 *
 * @param mongo the database connection.
 * @returns RequestHandler
 */
export const corsWhitelisted = (mongo: MongoContext) =>
  cors(createCorsOptionsDelegate(mongo));
