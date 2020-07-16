import { AppOptions } from "coral-server/app";
import { RawQueryNotAuthorized } from "coral-server/errors";
import { getPersistedQuery } from "coral-server/graph/persisted";
import { hasFeatureFlag } from "coral-server/models/tenant";
import { RequestHandler } from "coral-server/types/express";

import {
  GQLFEATURE_FLAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

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
    if (!req.coral || !req.coral.tenant) {
      throw new Error("tenant was not set");
    }

    // Handle the payload if it is a persisted query.
    const body = req.method === "GET" ? req.query : req.body;
    const persisted = await getPersistedQuery(persistedQueryCache, body);
    if (!persisted) {
      if (
        // Check to see if we currently require persisted queries for this
        // cluster.
        persistedQueriesRequired &&
        // Check to see if this is from an ADMIN token which is allowed to run
        // un-persisted queries.
        req.user?.role !== GQLUSER_ROLE.ADMIN &&
        // Check to see if this Tenant has permitted raw queries, otherwise they
        // cannot run un-persisted queries.
        !hasFeatureFlag(req.coral.tenant, GQLFEATURE_FLAG.PERMIT_RAW_QUERIES)
      ) {
        throw new RawQueryNotAuthorized(
          req.coral.tenant.id,
          body?.query || null,
          req.user?.id || null
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
