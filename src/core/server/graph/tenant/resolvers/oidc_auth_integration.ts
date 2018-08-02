import { GQLOIDCAuthIntegrationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { OIDCAuthIntegration } from "talk-server/models/settings";

const OIDCAuthIntegration: GQLOIDCAuthIntegrationTypeResolver<
  OIDCAuthIntegration
> = {
  config: auth => auth,
};

export default OIDCAuthIntegration;
