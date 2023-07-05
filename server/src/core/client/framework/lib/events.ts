import { EventEmitter2 } from "eventemitter2";

import { useCoralContext } from "./bootstrap";

/**
 * _Viewer Events_ are emitted when the viewer performs certain actions.
 * They can be subscribed to using the `events` parameter in
 * `Coral.createStreamEmbed`.
 */
export interface ViewerEvent<T> {
  name: string;
  emit: keyof T extends never
    ? (eventEmitter: EventEmitter2) => void
    : (eventEmitter: EventEmitter2, data: T) => void;
}

/**
 * A ViewerNetworkEventStarted represents ViewerNetworkEvent that has
 * started and is waiting for the response.
 */
export interface ViewerNetworkEventStarted<
  T extends { success: object; error: object }
> {
  /**
   * Emits a success event and include the rtt time.
   */
  success: keyof T["success"] extends never
    ? () => void
    : (success: T["success"]) => void;

  /**
   * Emits an error event and include the rtt time.
   */
  error: keyof T["error"] extends never
    ? () => void
    : (error: T["error"]) => void;
}

/**
 * _Viewer Network Events_ are _Viewer Events_ that involves a network request and
 * thus can succeed or fail. Succeeding events have the suffix `.success`
 * while failing events an `.error` suffix.
 *
 * Moreover _Viewer Network Events_ contain the `rtt` field which indicates
 * the time it needed from initiating the request until the _UI_ has been
 * updated with the response data.
 */
export interface ViewerNetworkEvent<
  T extends { success: object; error: object }
> {
  name: string;
  nameSuccess: string;
  nameError: string;
  /**
   * Mark the network request as started. This will also start tracking the rtt time.
   */
  begin: keyof T extends "success" | "error"
    ? (eventEmitter: EventEmitter2) => ViewerNetworkEventStarted<T>
    : (
        eventEmitter: EventEmitter2,
        data: Pick<T, Exclude<keyof T, "success" | "error">>
      ) => ViewerNetworkEventStarted<T>;
}

/**
 * createViewerEvent creates a ViewerNetworkEvent object.
 *
 * @param name name of the event
 */
export function createViewerNetworkEvent<
  T extends { success: object; error: object }
>(name: string): ViewerNetworkEvent<T> {
  return {
    name,
    nameSuccess: `viewer.${name}.success`,
    nameError: `viewer.${name}.error`,
    begin: ((eventEmitter, data) => {
      const ms = Date.now();
      return {
        success: ((success) => {
          const final: any = {
            ...data,
            rtt: Date.now() - ms,
          };
          if (success) {
            final.success = success;
          }
          eventEmitter.emit(`viewer.${name}.success`, final);
        }) as ViewerNetworkEventStarted<T>["success"],
        error: ((error) => {
          const final: any = {
            ...data,
            rtt: Date.now() - ms,
          };
          if (error) {
            final.error = error;
          }
          eventEmitter.emit(`viewer.${name}.error`, final);
        }) as ViewerNetworkEventStarted<T>["error"],
      };
    }) as ViewerNetworkEvent<T>["begin"],
  };
}

/**
 * createViewerEvent creates a ViewerEvent object.
 *
 * @param name name of the event
 */
export function createViewerEvent<T>(name: string): ViewerEvent<T> {
  return {
    name: `viewer.${name}`,
    emit: ((eventEmitter, data) => {
      eventEmitter.emit(`viewer.${name}`, data);
    }) as ViewerEvent<T>["emit"],
  };
}

/**
 * useViewerEvent inject the eventEmitter and returns a simple
 * callback to emit the event.
 */
export function useViewerEvent<T>(
  viewerEvent: ViewerEvent<T>
): keyof T extends never ? () => void : (data: T) => void {
  const { eventEmitter } = useCoralContext();
  return ((data?: T) => {
    viewerEvent.emit(eventEmitter, data as any);
  }) as any;
}

/**
 * useViewerNetworkEvent injects the eventEmitter into a ViewNetworkEvent
 * and returns a simple callback to begin the event.
 */
export function useViewerNetworkEvent<
  T extends { success: object; error: object }
>(
  viewerNetworkEvent: ViewerNetworkEvent<T>
): keyof T extends "success" | "error"
  ? () => ViewerNetworkEventStarted<T>
  : (
      data: Pick<T, Exclude<keyof T, "success" | "error">>
    ) => ViewerNetworkEventStarted<T> {
  const { eventEmitter } = useCoralContext();
  return ((data?: T) => {
    return viewerNetworkEvent.begin(eventEmitter, data as any);
  }) as any;
}
