import {
  GQLAuthIntegrations,
  GQLAuthIntegrationsResolvers,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

const disabled = { enabled: false };

export const AuthIntegrations: GQLAuthIntegrationsResolvers<
  GraphContext,
  GQLAuthIntegrations
> = {
  local: (auth) => auth.local || disabled,
  sso: (auth) => auth.sso || disabled,
  oidc: (auth) => auth.oidc || disabled,
  google: (auth) => auth.google || disabled,
  facebook: (auth) => auth.facebook || disabled,
};
