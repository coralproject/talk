import { GQLSSOAuthIntegrationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { SSOAuthIntegration } from "talk-server/models/tenant";

const SSOAuthIntegration: GQLSSOAuthIntegrationTypeResolver<
  SSOAuthIntegration
> = {
  config: auth => auth,
};

export default SSOAuthIntegration;
