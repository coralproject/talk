import * as tenant from "coral-server/models/tenant";

import { GQLWebhookEndpointResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const WebhookEndpoint: GQLWebhookEndpointResolvers<
  GraphContext,
  tenant.Endpoint
> = {
  signingSecret: ({ signingSecrets }) =>
    signingSecrets[signingSecrets.length - 1],
};
