import { NotifierQueue } from "coral-server/queue/tasks/notifier";
import { categories } from "coral-server/services/notifications/categories";

import {
  CommentFeaturedCoralEventPayload,
  CommentReplyCreatedCoralEventPayload,
  CommentStatusUpdatedCoralEventPayload,
} from "../events";
import { CoralEventListener, CoralEventPublisherFactory } from "../publisher";
import { CoralEventType } from "../types";

export type NotifierCoralEventListenerPayloads =
  | CommentFeaturedCoralEventPayload
  | CommentStatusUpdatedCoralEventPayload
  | CommentReplyCreatedCoralEventPayload;

export class NotifierCoralEventListener
  implements CoralEventListener<NotifierCoralEventListenerPayloads>
{
  public readonly name = "notifier";

  private readonly queue: NotifierQueue;

  constructor(queue: NotifierQueue) {
    this.queue = queue;
  }

  /**
   * events are the events that this listener handles. These are parsed from the
   * notification categories.
   */
  public readonly events = categories.reduce((events, category) => {
    for (const event of category.events) {
      if (!events.includes(event)) {
        events.push(event);
      }
    }

    return events;
  }, [] as CoralEventType[]);

  public initialize: CoralEventPublisherFactory<NotifierCoralEventListenerPayloads> =

      ({ tenant: { id } }) =>
      async (input) => {
        await this.queue.add({ tenantID: id, input });
      };
}
