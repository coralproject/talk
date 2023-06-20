import {
  GQLOIDCAuthIntegration,
  GQLOIDCAuthIntegrationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import { reconstructTenantURLResolver } from "./util";

export const OIDCAuthIntegration: GQLOIDCAuthIntegrationResolvers<
  GraphContext,
  GQLOIDCAuthIntegration
> = {
  callbackURL: reconstructTenantURLResolver("/api/auth/oidc/callback"),
  redirectURL: reconstructTenantURLResolver("/api/auth/oidc"),
};
