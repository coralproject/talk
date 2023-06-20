import {
  GQLGoogleAuthIntegration,
  GQLGoogleAuthIntegrationResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

import { reconstructTenantURLResolver } from "./util";

export const GoogleAuthIntegration: GQLGoogleAuthIntegrationResolvers<
  GraphContext,
  GQLGoogleAuthIntegration
> = {
  callbackURL: reconstructTenantURLResolver("/api/auth/google/callback"),
  redirectURL: reconstructTenantURLResolver("/api/auth/google"),
};
