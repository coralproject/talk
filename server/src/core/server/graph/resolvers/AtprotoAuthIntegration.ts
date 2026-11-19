import {
  GQLAtprotoAuthIntegration,
  GQLAtprotoAuthIntegrationTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { reconstructTenantURLResolver } from "./util";

// Suggests handles while users type them. Integrations saved before this
// setting existed use it, an empty value disables suggestions.
export const DEFAULT_ATPROTO_TYPEAHEAD_HOST = "https://public.api.bsky.app";

export const AtprotoAuthIntegration: GQLAtprotoAuthIntegrationTypeResolver<GQLAtprotoAuthIntegration> =
  {
    callbackURL: reconstructTenantURLResolver("/api/auth/atproto/callback"),
    clientMetadataURL: reconstructTenantURLResolver(
      "/api/auth/atproto/clientmetadata.json"
    ),
    authURL: reconstructTenantURLResolver("/api/auth/atproto"),
    typeaheadHost: ({ typeaheadHost }) =>
      typeaheadHost === undefined
        ? DEFAULT_ATPROTO_TYPEAHEAD_HOST
        : typeaheadHost || null,
  };
