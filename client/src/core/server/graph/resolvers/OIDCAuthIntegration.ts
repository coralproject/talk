import {
  GQLOIDCAuthIntegration,
  GQLOIDCAuthIntegrationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { reconstructTenantURLResolver } from "./util";

export const OIDCAuthIntegration: GQLOIDCAuthIntegrationTypeResolver<GQLOIDCAuthIntegration> =
  {
    callbackURL: reconstructTenantURLResolver("/api/auth/oidc/callback"),
    redirectURL: reconstructTenantURLResolver("/api/auth/oidc"),
  };
