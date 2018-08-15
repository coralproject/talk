import { GQLSSOAuthIntegrationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { SSOAuthIntegration } from "talk-server/models/settings";

const SSOAuthIntegration: GQLSSOAuthIntegrationTypeResolver<
  SSOAuthIntegration
> = {};

export default SSOAuthIntegration;
