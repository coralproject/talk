/* eslint-disable max-classes-per-file */

import GraphContext from "coral-server/graph/context";
import logger from "coral-server/logger";

import { CoralEventPayload } from "./event";
import { CoralEventType } from "./types";

export type CoralEventPublisher<T extends CoralEventPayload = any> = (
  payload: T
) => Promise<void>;

export type CoralEventPublisherFactory<T extends CoralEventPayload = any> = (
  ctx: GraphContext
) => CoralEventPublisher<T>;

export abstract class CoralEventListener<T extends CoralEventPayload = any> {
  /**
   * name is the name of the listener used for identification in logs.
   */
  public abstract readonly name: string;

  /**
   * disabled if true will disable the event listener from handling requests.
   */
  public abstract readonly disabled?: boolean;

  /**
   * events is the array of event types that this listener should listen for.
   */
  public abstract readonly events: CoralEventType[];

  /**
   * initialize is a function that when
   */
  public abstract initialize: CoralEventPublisherFactory<T>;
}

export class CoralEventPublisherBroker {
  private readonly ctx: GraphContext;
  private readonly events: Set<CoralEventType>;
  private readonly listeners: CoralEventListener[];
  private registry?: Map<CoralEventType, CoralEventPublisher[]>;

  constructor(
    ctx: GraphContext,
    events: Set<CoralEventType>,
    listeners: CoralEventListener[]
  ) {
    this.ctx = ctx;
    this.events = events;
    this.listeners = listeners;
  }

  private initialize() {
    const registry = new Map<CoralEventType, CoralEventPublisher[]>();

    // Iterate over the listeners to initialize them.
    for (const listener of this.listeners) {
      // Initialize this listener.
      const publisher = listener.initialize(this.ctx);

      // Associate the publisher with each of the events.
      for (const event of listener.events) {
        // Get the current publishers associated with this event.
        const publishers = registry.get(event) || [];

        // Add this publisher to the array.
        publishers.push(publisher);

        // Update this item in the registry.
        registry.set(event, publishers);
      }
    }

    return registry;
  }

  public emit = (payload: CoralEventPayload) => {
    // Check to see if this event is even registered.
    if (!this.events.has(payload.type)) {
      return;
    }

    // Lazily create the registry.
    if (!this.registry) {
      this.registry = this.initialize();
    }

    // Get the current publishers for this event. We can assert that this is
    // found because the event was checked in the above events set. If the event
    // did not exist in the events set, then it does not have an associated
    // registry entry.
    const publishers = this.registry.get(payload.type)!;

    // Begin resolving these publishers.
    return Promise.all(publishers.map((publisher) => publisher(payload)));
  };
}

export default class CoralEventListenerBroker {
  private readonly events = new Set<CoralEventType>();
  private readonly listeners: CoralEventListener[] = [];

  public instance = (ctx: GraphContext) =>
    new CoralEventPublisherBroker(ctx, this.events, this.listeners);

  public register(listener: CoralEventListener) {
    if (listener.events.length === 0) {
      logger.warn(
        { listenerName: listener.name },
        "listener was registered without any events"
      );
      return;
    }

    if (listener.disabled) {
      logger.info({ listenerName: listener.name }, "listener was disabled");
      return;
    }

    logger.trace(
      { listenerName: listener.name, listenerEvents: listener.events },
      "registering listener for events"
    );

    // Add this listener to this listener set.
    this.listeners.push(listener);

    // Add each event to the set of registered events.
    for (const event of listener.events) {
      this.events.add(event);
    }
  }
}
