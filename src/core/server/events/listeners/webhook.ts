import { WebhookQueue } from "coral-server/queue/tasks/webhook";

import { CoralEventType, StoryCreatedCoralEventPayload } from "../events";
import { CoralEventListener, CoralEventPublisherFactory } from "../publisher";

export type WebhookCoralEventListenerPayloads = StoryCreatedCoralEventPayload;

export class WebhookCoralEventListener
  implements CoralEventListener<WebhookCoralEventListenerPayloads> {
  public readonly name = "webhook";

  public readonly events = [CoralEventType.STORY_CREATED];

  private readonly queue: WebhookQueue;

  constructor(queue: WebhookQueue) {
    this.queue = queue;
  }

  public initialize: CoralEventPublisherFactory<
    WebhookCoralEventListenerPayloads
  > = ({ id, tenant }) => async event => {
    await this.queue.add({
      contextID: id,
      tenantID: tenant.id,
      event,
    });
  };
}
