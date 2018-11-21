import { constructTenantURL, reconstructURL } from "talk-server/app/url";
import {
  GQLGoogleAuthIntegration,
  GQLGoogleAuthIntegrationTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";

export const GoogleAuthIntegration: GQLGoogleAuthIntegrationTypeResolver<
  GQLGoogleAuthIntegration
> = {
  callbackURL: (integration, args, ctx) => {
    const path = `/api/tenant/auth/google/callback`;

    // If the request is available, then prefer it over building from the tenant
    // as the tenant does not include the port number. This should only really
    // be a problem if the graph API is called internally.
    if (ctx.req) {
      return reconstructURL(ctx.req, path);
    }

    // Note that when constructing the callback url with the tenant, the port
    // information is lost.
    return constructTenantURL(ctx.config, ctx.tenant, path);
  },
};
