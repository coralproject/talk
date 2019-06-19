import { createSubscriptionChannelName } from "coral-server/graph/tenant/resolvers/Subscription/helpers";
import { SUBSCRIPTION_INPUT } from "coral-server/graph/tenant/resolvers/Subscription/types";
import logger from "coral-server/logger";

export interface Publisher {
  publish(trigger: string, payload: any): Promise<void>;
}

export async function publish(
  pubsub: Publisher,
  tenantID: string,
  { channel, payload }: SUBSCRIPTION_INPUT
) {
  logger.trace({ channel, tenantID }, "publishing event");

  return pubsub.publish(
    createSubscriptionChannelName(tenantID, channel),
    payload
  );
}
