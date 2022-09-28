import {
  GQLFacebookAuthIntegration,
  GQLFacebookAuthIntegrationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { reconstructTenantURLResolver } from "./util";

export const FacebookAuthIntegration: GQLFacebookAuthIntegrationTypeResolver<GQLFacebookAuthIntegration> =
  {
    callbackURL: reconstructTenantURLResolver("/api/auth/facebook/callback"),
    redirectURL: reconstructTenantURLResolver("/api/auth/facebook"),
  };
