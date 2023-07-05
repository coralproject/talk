import { useMemo } from "react";

import { GQLFEATURE_FLAG } from "coral-framework/schema";

import { FEATURE_FLAG } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";

interface Props {
  story: {
    isClosed: boolean;
    settings: {
      live: {
        enabled: boolean;
      };
    };
  };
  settings: {
    disableCommenting: {
      enabled: boolean;
    };
    featureFlags?: ReadonlyArray<FEATURE_FLAG>;
  };
}

const useLive = ({ story, settings }: Props) =>
  useMemo(() => {
    if (
      // If live updates are disable for this story...
      !story.settings.live.enabled ||
      // Or the story is closed...
      story.isClosed ||
      // Or commenting is disabled...
      settings.disableCommenting.enabled ||
      // Or it is disabled at the tenant level via a feature flag
      settings.featureFlags?.includes(GQLFEATURE_FLAG.DISABLE_LIVE_UPDATES)
    ) {
      // Then we aren't live!
      return false;
    }

    // The story is open! Mark the story as open.
    return true;
  }, [
    // When used in conjunction with the StoryClosedTimeoutContainer, we don't
    // have to inspect the `story.closedAt` because it'll update the store for
    // us!
    story.isClosed,
    settings.disableCommenting.enabled,
    story.settings.live.enabled,
    settings.featureFlags,
  ]);

export default useLive;
