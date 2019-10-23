import { EventEmitter2 } from "eventemitter2";
import { useCoralContext } from "./bootstrap";

/**
 * A ViewerEvent represents an action triggered by the viewer.
 */
export interface ViewerEvent<T> {
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
 * A ViewerNetworkEvent represents an action triggered by the viewer that
 * involves a network request.
 */
export interface ViewerNetworkEvent<
  T extends { success: object; error: object }
> {
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
 * A ViewerLoadMoreEvent is a ViewerNetworkEvent with a
 * standard shape for load more events.
 */
export type ViewerLoadMoreEvent = ViewerNetworkEvent<{
  count: number;
  success: {};
  error: { message: string; code: string };
}>;

/**
 * createViewerEvent creates a ViewerNetworkEvent object.
 *
 * @param name name of the event
 */
export function createViewerNetworkEvent<
  T extends { success: object; error: object }
>(name: string): ViewerNetworkEvent<T> {
  return {
    begin: ((eventEmitter, data) => {
      const ms = Date.now();
      return {
        success: (success => {
          const final: any = {
            ...data,
            rtt: Date.now() - ms,
          };
          if (success) {
            final.success = success;
          }
          eventEmitter.emit(`${name}.success`, final);
        }) as ViewerNetworkEventStarted<T>["success"],
        error: (error => {
          const final: any = {
            ...data,
            rtt: Date.now() - ms,
          };
          if (error) {
            final.error = error;
          }
          eventEmitter.emit(`${name}.error`, final);
        }) as ViewerNetworkEventStarted<T>["error"],
      };
    }) as ViewerNetworkEvent<T>["begin"],
  };
}

/**
 * createViewerLoadMoreEvent creates a ViewerLoadMoreEvent object.
 *
 * @param name name of the event
 */
export function createViewerLoadMoreEvent(name: string): ViewerLoadMoreEvent {
  return createViewerNetworkEvent(name);
}

/**
 * createViewerEvent creates a ViewerEvent object.
 *
 * @param name name of the event
 */
export function createViewerEvent<T>(name: string): ViewerEvent<T> {
  return {
    emit: ((eventEmitter, data) => {
      eventEmitter.emit(name, data);
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
