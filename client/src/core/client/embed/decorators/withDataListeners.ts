import { EventEmitter2 } from "eventemitter2";

/**
 * withDataListeners handles dispatching data events to the light DOM based on user configuration.
 * This prevents conflicts with existing custom events on the user's page.
 */
const withDataListeners = (
  streamEventEmitter: EventEmitter2,
  dataListeners?: string[]
) => {
  if (!dataListeners || dataListeners.length === 0) {
    return;
  }

  // Create a set for faster lookups
  const enabledListeners = new Set(dataListeners);

  // Listen for commentCount events and dispatch data events if enabled
  if (enabledListeners.has("commentCount")) {
    streamEventEmitter.on("commentCount", (eventData) => {
      // Dispatch data event to the light DOM with namespaced name
      const customEvent = new CustomEvent("coral.commentCount", {
        detail: eventData,
        bubbles: true, // Allow the event to bubble up to parent elements
        composed: true, // Allow the event to cross shadow DOM boundaries
      });

      // Dispatch from the current target (shadow DOM) - it will bubble up
      window.dispatchEvent(customEvent);
    });
  }

  // Future data listeners can be added here following the same pattern
  // if (enabledListeners.has("someOtherData")) {
  //   streamEventEmitter.on("someOtherData", (eventData) => {
  //     const customEvent = new CustomEvent("coral.someOtherData", {
  //       detail: eventData,
  //       bubbles: true,
  //       composed: true,
  //     });
  //     window.dispatchEvent(customEvent);
  //   });
  // }
};

export default withDataListeners;
