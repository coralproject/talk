import { IntegrationDisabled } from "coral-server/errors";
import { GoogleAuthIntegration } from "coral-server/models/settings";

export function getEnabledIntegration(
  integration: GoogleAuthIntegration
): Required<GoogleAuthIntegration> {
  if (!integration.enabled) {
    throw new IntegrationDisabled("facebook");
  }

  if (!integration.clientID || !integration.clientSecret) {
    throw new IntegrationDisabled("facebook");
  }

  return integration as Required<GoogleAuthIntegration>;
}
