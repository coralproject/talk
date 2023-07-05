import logger from "coral-server/logger";
import { WebhookQueue } from "coral-server/queue/tasks/webhook";

import { GQLWEBHOOK_EVENT_NAME } from "coral-server/graph/schema/__generated__/types";

import { StoryCreatedCoralEventPayload } from "../events";
import { CoralEventListener, CoralEventPublisherFactory } from "../publisher";
import { CoralEventType } from "../types";

export type WebhookCoralEventListenerPayloads = StoryCreatedCoralEventPayload;

export class WebhookCoralEventListener
  implements CoralEventListener<WebhookCoralEventListenerPayloads>
{
  public readonly name = "webhook";
  public readonly events = [
    CoralEventType.STORY_CREATED,
    CoralEventType.COMMENT_CREATED,
    CoralEventType.COMMENT_REPLY_CREATED,
  ];

  private readonly queue: WebhookQueue;

  constructor(queue: WebhookQueue) {
    this.queue = queue;
  }

  public initialize: CoralEventPublisherFactory<WebhookCoralEventListenerPayloads> =

      ({ id: contextID, tenant }) =>
      async (event) => {
        const log = logger.child(
          {
            tenantID: tenant.id,
            contextID,
            eventType: event.type,
          },
          true
        );

        // Based on the incoming event, determine which endpoints we should send.
        const endpoints = tenant.webhooks.endpoints.filter((endpoint) => {
          // If the endpoint is disabled, don't include it.
          if (!endpoint.enabled) {
            return false;
          }

          // If all notifications have been enabled for this endpoint, include it.
          if (endpoint.all) {
            return true;
          }

          // If this event name is specifically listed, include it. We have to do
          // some nasty casting here to address the fact that the types don't
          // technically overlap.
          if (
            endpoint.events.includes(
              event.type as unknown as GQLWEBHOOK_EVENT_NAME
            )
          ) {
            return true;
          }

          return false;
        });

        // Log some important details.
        if (endpoints.length === 0) {
          log.debug("no endpoints matched for event");
          return;
        }

        log.debug(
          { endpoints: endpoints.length },
          "matched endpoints that will receive event"
        );

        // For each of these endpoints that need a delivery of these notifications,
        // queue up the job that will send it.
        await Promise.all(
          endpoints.map((endpoint) =>
            this.queue.add({
              tenantID: tenant.id,
              contextID,
              endpointID: endpoint.id,
              event,
            })
          )
        );
      };
}
