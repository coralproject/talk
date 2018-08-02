import { GQLGoogleAuthIntegrationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { GoogleAuthIntegration } from "talk-server/models/tenant";

const GoogleAuthIntegration: GQLGoogleAuthIntegrationTypeResolver<
  GoogleAuthIntegration
> = {
  config: auth => auth,
};

export default GoogleAuthIntegration;
