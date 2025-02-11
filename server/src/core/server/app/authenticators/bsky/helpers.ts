import { IntegrationDisabled } from "coral-server/errors";
import { BskyAuthIntegration } from "coral-server/models/settings";

export function getEnabledIntegration(
  integration: BskyAuthIntegration
): Required<BskyAuthIntegration> {
  if (!integration.enabled) {
    throw new IntegrationDisabled("bsky");
  }

  if (!integration.clientID || !integration.clientSecret) {
    throw new IntegrationDisabled("bsky");
  }

  return integration as Required<BskyAuthIntegration>;
}
