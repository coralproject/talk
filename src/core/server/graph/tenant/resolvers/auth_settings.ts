import { GQLAuthSettingsTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { Auth } from "talk-server/models/settings";

const AuthSettings: GQLAuthSettingsTypeResolver<Auth> = {
  integrations: auth => auth.integrations,
};

export default AuthSettings;
