import { AppOptions } from "coral-server/app";
import { RawQueryNotAuthorized } from "coral-server/errors";
import { getPersistedQuery } from "coral-server/graph/common/persisted";
import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";
import { RequestHandler } from "coral-server/types/express";

type PersistedQueryMiddlewareOptions = Pick<
  AppOptions,
  "persistedQueryCache" | "persistedQueriesRequired"
>;

const persistedQueryMiddleware = ({
  persistedQueriesRequired,
  persistedQueryCache,
}: PersistedQueryMiddlewareOptions): RequestHandler => async (
  req,
  res,
  next
) => {
  try {
    if (!req.coral) {
      throw new Error("coral was not set");
    }

    // Pull out some useful properties from Coral.
    const { tenant } = req.coral;
    if (!tenant) {
      throw new Error("tenant was not set");
    }

    // Handle the payload if it is a persisted query.
    const body = req.method === "GET" ? req.query : req.body;
    const persisted = await getPersistedQuery(persistedQueryCache, body);
    if (!persisted) {
      // Check to see if this is from an ADMIN token which is allowed to run
      // un-persisted queries.
      if (
        persistedQueriesRequired &&
        (!req.user || req.user.role !== GQLUSER_ROLE.ADMIN)
      ) {
        throw new RawQueryNotAuthorized(
          tenant.id,
          req.user ? req.user.id : null
        );
      }
    } else {
      // The query was found for this operation, replace the query with the one
      // provided.
      body.query = persisted.query;

      // Associate the persisted query with the request so it can be attached to
      // the context.
      req.coral.persisted = persisted;
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

export default persistedQueryMiddleware;
