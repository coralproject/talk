import { v4 as uuid } from "uuid";

import logger from "coral-server/logger";

import { CoralEventPublisherBroker } from "./publisher";
import { CoralEventType } from "./types";

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

export interface CoralEvent<T> {
  publish: (broker: CoralEventPublisherBroker, data: T) => Promise<void>;
}

export function createCoralEvent<T extends CoralEventPayload>(
  type: T["type"],
  options: {
    forward?: Array<CoralEvent<T["data"]>>;
  } = {}
): CoralEvent<T["data"]> {
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
      const promises: Promise<any>[] = [Promise.resolve(broker.emit(event))];
      if (options.forward) {
        promises.push(...options.forward.map((f) => f.publish(broker, data)));
      }
      await Promise.all(promises);
    },
  };
}
