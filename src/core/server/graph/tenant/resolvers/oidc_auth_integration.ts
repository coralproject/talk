import { GQLOIDCAuthIntegrationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { OIDCAuthIntegration } from "talk-server/models/settings";

const OIDCAuthIntegration: GQLOIDCAuthIntegrationTypeResolver<
  OIDCAuthIntegration
> = {};

export default OIDCAuthIntegration;
