import {
  GQLGoogleAuthIntegration,
  GQLGoogleAuthIntegrationTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";

import { reconstructTenantURL } from "./util";

export const GoogleAuthIntegration: GQLGoogleAuthIntegrationTypeResolver<
  GQLGoogleAuthIntegration
> = {
  callbackURL: reconstructTenantURL("/api/tenant/auth/google/callback"),
  redirectURL: reconstructTenantURL("/api/tenant/auth/google"),
};
