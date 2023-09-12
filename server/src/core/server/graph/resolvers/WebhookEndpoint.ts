import * as tenant from "coral-server/models/tenant";

import { GQLWebhookEndpointTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const WebhookEndpoint: GQLWebhookEndpointTypeResolver<tenant.Endpoint> =
  {
    signingSecret: ({ signingSecrets }) =>
      signingSecrets[signingSecrets.length - 1],
  };
