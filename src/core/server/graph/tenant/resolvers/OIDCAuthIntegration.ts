import {
  GQLOIDCAuthIntegration,
  GQLOIDCAuthIntegrationTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";

import { reconstructTenantURLResolver } from "./util";

export const OIDCAuthIntegration: GQLOIDCAuthIntegrationTypeResolver<
  GQLOIDCAuthIntegration
> = {
  callbackURL: reconstructTenantURLResolver("/api/tenant/auth/oidc/callback"),
  redirectURL: reconstructTenantURLResolver("/api/tenant/auth/oidc"),
};
