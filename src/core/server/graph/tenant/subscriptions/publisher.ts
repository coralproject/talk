import { RedisPubSub } from "graphql-redis-subscriptions";

import { createSubscriptionChannelName } from "coral-server/graph/tenant/resolvers/Subscription/helpers";
import { SUBSCRIPTION_INPUT } from "coral-server/graph/tenant/resolvers/Subscription/types";
import logger from "coral-server/logger";
import { NotifierQueue } from "coral-server/queue/tasks/notifier";

export type Publisher = (input: SUBSCRIPTION_INPUT) => Promise<void>;

/**
 * createPublisher will create a new Publisher that can be used to send events
 * over the pubsub broker to facilitate live updates and notifications.
 *
 * @param pubsub the pubsub broker to be used to facilitate the publish action
 * @param tenantID the ID of the Tenant where the event will be published with
 * @param clientID the ID of the client to de-duplicate mutation responses
 */
export const createPublisher = (
  pubsub: RedisPubSub,
  notifier: NotifierQueue,
  tenantID: string,
  clientID?: string
): Publisher => async input => {
  const { channel, payload } = input;

  logger.trace({ channel, tenantID, clientID }, "publishing event");

  // Start the publishing operation out to all affected subscribers.
  await Promise.all([
    // Publish to the underlying pubsub system for subscriptions.
    pubsub.publish(createSubscriptionChannelName(tenantID, channel), {
      ...payload,
      clientID,
    }),
    // Notify the notifications queue so we can offload notification processing
    // to it.
    notifier.add({ tenantID, input }),
  ]);
};
