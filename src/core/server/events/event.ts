import uuid from "uuid/v4";

import logger from "coral-server/logger";

import { CoralEventType } from "./events";
import { CoralEventPublisherBroker } from "./publisher";

export interface CoralEventPayload<
  T extends CoralEventType = CoralEventType,
  U extends {} = {}
> {
  /**
   * id is the identifier for this specific event. Every copy of this unique
   * event will share the same identifier.
   */
  readonly id: string;

  /**
   * type identifies this particular event.
   */
  readonly type: T;

  /**
   * data stores the underlying content of the event.
   */
  readonly data: Readonly<U>;

  /**
   * createdAt is the date that this event was published at.
   */
  readonly createdAt: Date;
}

export function createCoralEvent<T extends CoralEventPayload>(type: T["type"]) {
  return {
    publish: async (broker: CoralEventPublisherBroker, data: T["data"]) => {
      const event: CoralEventPayload = {
        id: uuid(),
        createdAt: new Date(),
        data,
        type,
      };

      logger.trace(
        { eventType: event.type, eventID: event.id },
        "publishing event"
      );
      await broker.emit(event);
    },
  };
}
