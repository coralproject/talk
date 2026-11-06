import {
  GQLAuthIntegrations,
  GQLAuthIntegrationsTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

const disabled = { enabled: false };

// Tenants created before the atproto integration existed don't have it stored,
// so fall back to a complete, disabled integration.
const atprotoDisabled = {
  enabled: false,
  allowRegistration: false,
  targetFilter: { admin: true, stream: true },
};

export const AuthIntegrations: GQLAuthIntegrationsTypeResolver<GQLAuthIntegrations> =
  {
    local: (auth) => auth.local || disabled,
    sso: (auth) => auth.sso || disabled,
    oidc: (auth) => auth.oidc || disabled,
    google: (auth) => auth.google || disabled,
    facebook: (auth) => auth.facebook || disabled,
    atproto: (auth) => auth.atproto || atprotoDisabled,
  };
