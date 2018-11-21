import {
  GQLAuthIntegrations,
  GQLAuthIntegrationsTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";

const disabled = { enabled: false };

export const AuthIntegrations: GQLAuthIntegrationsTypeResolver<
  GQLAuthIntegrations
> = {
  local: auth => auth.local || disabled,
  sso: auth => auth.sso || disabled,
  oidc: auth => auth.oidc || disabled,
  google: auth => auth.google || disabled,
  facebook: auth => auth.facebook || disabled,
};
