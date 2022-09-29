import {
  GQLGoogleAuthIntegration,
  GQLGoogleAuthIntegrationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { reconstructTenantURLResolver } from "./util";

export const GoogleAuthIntegration: GQLGoogleAuthIntegrationTypeResolver<GQLGoogleAuthIntegration> =
  {
    callbackURL: reconstructTenantURLResolver("/api/auth/google/callback"),
    redirectURL: reconstructTenantURLResolver("/api/auth/google"),
  };
