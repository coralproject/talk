# events

This is the events package for Coral.

## Adding new events

You can add new events by adding to the `events.ts` file. Each event must export
a `{ eventName }Payload` type and a `{ eventName }` Coral Event.

## Adding new event listeners

You can add a new event listener by adding to the `listeners/` folder. These
events must implement the `CoralEventListener` abstract class. You can then
register this listener in the `src/core/server/index.ts` file by registering
it on the broker.
