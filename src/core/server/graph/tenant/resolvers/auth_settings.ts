import { GQLAuthSettingsTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { Auth, AuthIntegration } from "talk-server/models/tenant";

const disabled: AuthIntegration = { enabled: false };

const AuthSettings: GQLAuthSettingsTypeResolver<Auth> = {
  local: auth => auth.local || disabled,
  sso: auth => auth.sso || disabled,
  oidc: auth => auth.oidc || disabled,
  google: auth => auth.google || disabled,
  facebook: auth => auth.facebook || disabled,
};

export default AuthSettings;
