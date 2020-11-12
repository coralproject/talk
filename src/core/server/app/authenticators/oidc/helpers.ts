import { IntegrationDisabled } from "coral-server/errors";
import { OIDCAuthIntegration } from "coral-server/models/settings";

export function getEnabledIntegration(
  integration: OIDCAuthIntegration
): Required<OIDCAuthIntegration> {
  if (!integration.enabled) {
    throw new IntegrationDisabled("oidc");
  }

  if (
    !integration.name ||
    !integration.clientID ||
    !integration.clientSecret ||
    !integration.authorizationURL ||
    !integration.tokenURL ||
    !integration.jwksURI ||
    !integration.issuer
  ) {
    throw new IntegrationDisabled("oidc");
  }

  return integration as Required<OIDCAuthIntegration>;
}
