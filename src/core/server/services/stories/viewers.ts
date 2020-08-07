import { LiveStoryViewersUpdateEvent } from "coral-server/events";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";

export async function publishViewersUpdate(
  broker: CoralEventPublisherBroker,
  storyID: string,
  viewerCount: number
) {
  void LiveStoryViewersUpdateEvent.publish(broker, {
    storyID,
    viewerCount,
  });
}
