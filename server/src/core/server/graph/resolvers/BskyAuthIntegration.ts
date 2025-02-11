import {
  GQLBskyAuthIntegration,
  GQLBskyAuthIntegrationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { reconstructTenantURLResolver } from "./util";

export const BskyAuthIntegration: GQLBskyAuthIntegrationTypeResolver<GQLBskyAuthIntegration> =
  {
    callbackURL: reconstructTenantURLResolver("/api/auth/bsky/callback"),
    redirectURL: reconstructTenantURLResolver("/api/auth/bsky"),
  };
