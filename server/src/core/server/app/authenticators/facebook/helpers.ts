import { IntegrationDisabled } from "coral-server/errors";
import { FacebookAuthIntegration } from "coral-server/models/settings";

export function getEnabledIntegration(
  integration: FacebookAuthIntegration
): Required<FacebookAuthIntegration> {
  if (!integration.enabled) {
    throw new IntegrationDisabled("facebook");
  }

  if (!integration.clientID || !integration.clientSecret) {
    throw new IntegrationDisabled("facebook");
  }

  return integration as Required<FacebookAuthIntegration>;
}
