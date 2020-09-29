import { NotifierQueue } from "coral-server/queue/tasks/notifier";
import { categories } from "coral-server/services/notifications/categories";
import { singleton } from "tsyringe";

import {
  CommentFeaturedCoralEventPayload,
  CommentReplyCreatedCoralEventPayload,
  CommentStatusUpdatedCoralEventPayload,
} from "../events";
import { CoralEventHandler, CoralEventListener } from "../listener";
import { CoralEventType } from "../types";

export type NotifierCoralEventListenerPayloads =
  | CommentFeaturedCoralEventPayload
  | CommentStatusUpdatedCoralEventPayload
  | CommentReplyCreatedCoralEventPayload;

@singleton()
export class NotifierCoralEventListener
  implements CoralEventListener<NotifierCoralEventListenerPayloads> {
  public readonly name = "notifier";

  constructor(private readonly queue: NotifierQueue) {}

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

  public handle: CoralEventHandler<NotifierCoralEventListenerPayloads> = async (
    { tenant: { id } },
    input
  ) => {
    await this.queue.add({ tenantID: id, input });
  };
}
