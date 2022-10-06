import { AppOptions } from "coral-server/app";
import { RawQueryNotAuthorized } from "coral-server/errors";
import { getPersistedQuery } from "coral-server/graph/persisted";
import { hasFeatureFlag } from "coral-server/models/tenant";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import {
  GQLFEATURE_FLAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

type PersistedQueryMiddlewareOptions = Pick<
  AppOptions,
  "persistedQueryCache" | "persistedQueriesRequired"
>;

export const persistedQueryMiddleware = ({
  persistedQueriesRequired,
  persistedQueryCache,
}: PersistedQueryMiddlewareOptions): RequestHandler<
  TenantCoralRequest
> => async (req, res, next) => {
  try {
    // Handle the payload if it is a persisted query.
    const body = req.method === "GET" ? req.query : req.body;
    const persisted = await getPersistedQuery(persistedQueryCache, body);
    if (persisted) {
      // The query was found for this operation, replace the query with the one
      // provided.
      body.query = persisted.query;

      // Associate the persisted query with the request so it can be attached to
      // the context.
      req.coral.persisted = persisted;

      return next();
    }

    // If persisted queries are not required, then it's ok that we're not
    // submitting a persisted query.
    if (!persistedQueriesRequired) {
      return next();
    }

    // If the feature flag for reduced security mode is enabled, then we will
    // allow non-persisted queries.
    if (
      hasFeatureFlag(req.coral.tenant, GQLFEATURE_FLAG.REDUCED_SECURITY_MODE)
    ) {
      return next();
    }

    // If the user is an administrator, then permit the non-persisted query.
    if (req.user?.role === GQLUSER_ROLE.ADMIN) {
      return next();
    }

    throw new RawQueryNotAuthorized(
      req.coral.tenant.id,
      body.query || null,
      req.user?.id || null
    );
  } catch (err) {
    return next(err);
  }
};
