import {
  GQLAtprotoAuthIntegration,
  GQLAtprotoAuthIntegrationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { reconstructTenantURLResolver } from "./util";

export const AtprotoAuthIntegration: GQLAtprotoAuthIntegrationTypeResolver<GQLAtprotoAuthIntegration> =
  {
    callbackURL: reconstructTenantURLResolver("/api/auth/atproto/callback"),
    authURL: reconstructTenantURLResolver("/api/auth/atproto"),
  };
