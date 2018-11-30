import {
  GQLOIDCAuthIntegration,
  GQLOIDCAuthIntegrationTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";

import { reconstructTenantURL } from "./util";

export const OIDCAuthIntegration: GQLOIDCAuthIntegrationTypeResolver<
  GQLOIDCAuthIntegration
> = {
  callbackURL: reconstructTenantURL("/api/tenant/auth/oidc/callback"),
  redirectURL: reconstructTenantURL("/api/tenant/auth/oidc"),
};
