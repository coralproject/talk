import {
  GQLFacebookAuthIntegration,
  GQLFacebookAuthIntegrationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import { reconstructTenantURLResolver } from "./util";

import GraphContext from "../context";

export const FacebookAuthIntegration: GQLFacebookAuthIntegrationResolvers<
  GraphContext,
  GQLFacebookAuthIntegration
> = {
  callbackURL: reconstructTenantURLResolver("/api/auth/facebook/callback"),
  redirectURL: reconstructTenantURLResolver("/api/auth/facebook"),
};
