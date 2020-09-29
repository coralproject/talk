import { injectAll, registry, singleton } from "tsyringe";

import { Context } from "coral-server/context";
import logger from "coral-server/logger";

import { CoralEventPayload } from "./event";
import { CoralEventListener } from "./listener";
import {
  AnalyticsCoralEventListener,
  NotifierCoralEventListener,
  PerspectiveCoralEventListener,
  SlackCoralEventListener,
  SubscriptionCoralEventListener,
  ViewersCoralEventListener,
  WebhookCoralEventListener,
} from "./listeners";
import { CoralEventType } from "./types";

export interface CoralEventPublisherBroker {
  emit: (payload: CoralEventPayload) => Promise<void>;
}

export const LISTENERS = Symbol("LISTENERS");

@singleton()
@registry([
  { token: LISTENERS, useClass: AnalyticsCoralEventListener },
  { token: LISTENERS, useClass: NotifierCoralEventListener },
  { token: LISTENERS, useClass: PerspectiveCoralEventListener },
  { token: LISTENERS, useClass: SlackCoralEventListener },
  { token: LISTENERS, useClass: SubscriptionCoralEventListener },
  { token: LISTENERS, useClass: ViewersCoralEventListener },
  { token: LISTENERS, useClass: WebhookCoralEventListener },
])
export default class CoralEventEmitter {
  private readonly registry = new Map<CoralEventType, CoralEventListener[]>();

  constructor(@injectAll(LISTENERS) listeners: CoralEventListener[]) {
    for (const listener of listeners) {
      if (listener.events.length === 0) {
        logger.warn(
          { listenerName: listener.name },
          "listener was registered without any events"
        );
        continue;
      }

      if (listener.disabled) {
        logger.info({ listenerName: listener.name }, "listener was disabled");
        continue;
      }

      logger.trace(
        { listenerName: listener.name, listenerEvents: listener.events },
        "registering listener for events"
      );

      // Add each event to the set of registered events.
      for (const event of listener.events) {
        // Get the current publishers associated with this event.
        const publishers = this.registry.get(event) || [];

        // Add this publisher to the array.
        publishers.push(listener);

        // Update this item in the registry.
        this.registry.set(event, publishers);
      }
    }
  }

  public instance = (ctx: Context): CoralEventPublisherBroker => ({
    emit: async (payload: CoralEventPayload) => {
      // Get the listeners for this event.
      const listeners = this.registry.get(payload.type);
      if (!listeners) {
        return;
      }

      // Begin resolving these listener.
      await Promise.all(
        listeners.map((listener) => listener.handle(ctx, payload))
      );
    },
  });
}
