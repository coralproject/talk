import { GQLGoogleAuthIntegrationTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { GoogleAuthIntegration } from "talk-server/models/settings";

const GoogleAuthIntegration: GQLGoogleAuthIntegrationTypeResolver<
  GoogleAuthIntegration
> = {};

export default GoogleAuthIntegration;
