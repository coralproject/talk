import { RedisPubSub } from "graphql-redis-subscriptions";

import { createSubscriptionChannelName } from "coral-server/graph/resolvers/Subscription/helpers";
import { SUBSCRIPTION_INPUT } from "coral-server/graph/resolvers/Subscription/types";
import logger from "coral-server/logger";
import { NotifierQueue } from "coral-server/queue/tasks/notifier";
import { SlackPublisher } from "coral-server/services/slack/publisher";

export type Publisher = (input: SUBSCRIPTION_INPUT) => Promise<void>;

export interface PublisherOptions {
  pubsub: RedisPubSub;
  slackPublisher: SlackPublisher;
  notifierQueue: NotifierQueue;
  tenantID: string;
  clientID?: string;
}

/**
 * createPublisher will create a new Publisher that can be used to send events
 * over the pubsub broker to facilitate live updates and notifications.
 *
 * TODO: Update
 *
 * @param options options object
 * @param options.pubsub the pubsub broker to be used to facilitate the publish action
 * @param options.slackPublisher the slack publisher instance
 * @param options.notifierQueue the queue
 * @param options.tenantID the ID of the Tenant where the event will be published with
 * @param options.clientID the ID of the client to de-duplicate mutation responses
 */
export const createPublisher = ({
  pubsub,
  slackPublisher,
  notifierQueue,
  tenantID,
  clientID,
}: PublisherOptions): Publisher => async input => {
  const { channel, payload } = input;

  logger.trace({ channel, tenantID, clientID }, "publishing event");

  // Start the publishing operation out to all affected subscribers.
  await Promise.all([
    // Publish to the underlying pubsub system for subscriptions.
    pubsub.publish(createSubscriptionChannelName(tenantID, channel), {
      ...payload,
      clientID,
    }),

    slackPublisher(channel, payload),

    // Notify the notifications queue so we can offload notification processing
    // to it.
    notifierQueue.add({ tenantID, input }),
  ]);
};
