import {
  GQLFacebookAuthIntegration,
  GQLFacebookAuthIntegrationTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";

import { reconstructTenantURL } from "./util";

export const FacebookAuthIntegration: GQLFacebookAuthIntegrationTypeResolver<
  GQLFacebookAuthIntegration
> = {
  callbackURL: reconstructTenantURL("/api/tenant/auth/facebook/callback"),
  redirectURL: reconstructTenantURL("/api/tenant/auth/facebook"),
};
