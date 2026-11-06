import { IntegrationDisabled } from "coral-server/errors";
import { AtprotoAuthIntegration } from "coral-server/models/settings";

export function getEnabledIntegration(
  integration: AtprotoAuthIntegration | undefined
): AtprotoAuthIntegration {
  // A public atproto client has no secret, so only being enabled is required.
  if (!integration || !integration.enabled) {
    throw new IntegrationDisabled("atproto");
  }

  return integration;
}
