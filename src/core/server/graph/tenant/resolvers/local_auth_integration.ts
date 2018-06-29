import { GQLLocalAuthIntegrationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { LocalAuthIntegration } from "talk-server/models/tenant";

const LocalAuthIntegration: GQLLocalAuthIntegrationTypeResolver<
  LocalAuthIntegration
> = {};

export default LocalAuthIntegration;
