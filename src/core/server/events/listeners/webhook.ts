import { WebhookQueue } from "coral-server/queue/tasks/webhook";

import { CoralEventListener, CoralEventPublisherFactory } from "../publisher";

export type WebhookCoralEventListenerPayloads = never;

export class WebhookCoralEventListener
  implements CoralEventListener<WebhookCoralEventListenerPayloads> {
  public readonly name = "webhook";

  public readonly events = [];

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
