import { GQLAuthIntegrationsTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  AuthIntegrations,
  EnableableIntegration,
} from "talk-server/models/settings";

const disabled: EnableableIntegration = { enabled: false };

const AuthIntegrations: GQLAuthIntegrationsTypeResolver<AuthIntegrations> = {
  local: auth => auth.local || disabled,
  sso: auth => auth.sso || disabled,
  oidc: auth => auth.oidc || disabled,
  google: auth => auth.google || disabled,
  facebook: auth => auth.facebook || disabled,
};

export default AuthIntegrations;
