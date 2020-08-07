import { SubscriptionToLiveStoryViewersUpdateResolver } from "coral-server/graph/schema/__generated__/types";

import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface LiveStoryViewersUpdateInput extends SubscriptionPayload {
  viewerCount: number;
  storyID: string;
}

export type LiveStoryViewersUpdateSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.LIVE_STORY_VIEWERS_UPDATE,
  LiveStoryViewersUpdateInput
>;

export const liveStoryViewersUpdate: SubscriptionToLiveStoryViewersUpdateResolver<LiveStoryViewersUpdateInput> = createIterator(
  SUBSCRIPTION_CHANNELS.LIVE_STORY_VIEWERS_UPDATE,
  {
    filter: (source, { storyID }) => {
      if (source.storyID !== storyID) {
        return false;
      }

      return true;
    },
  }
);
