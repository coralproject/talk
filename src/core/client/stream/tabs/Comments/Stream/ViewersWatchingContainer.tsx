import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import { useLive, useVisibilityState } from "coral-framework/hooks";
import { withInView } from "coral-framework/lib/intersection";
import { useFetch, withFragmentContainer } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { ViewersWatchingContainer_settings } from "coral-stream/__generated__/ViewersWatchingContainer_settings.graphql";
import { ViewersWatchingContainer_story } from "coral-stream/__generated__/ViewersWatchingContainer_story.graphql";

import RefreshStoryViewerCount from "./RefreshStoryViewerCount";

import styles from "./ViewersWatchingContainer.css";

interface Props {
  inView: boolean | undefined;
  intersectionRef: React.Ref<any>;
  story: ViewersWatchingContainer_story;
  settings: ViewersWatchingContainer_settings;
}

const TIMEOUT = 20000;
const TIMEOUT_JITTER = TIMEOUT / 2;
const MAX_TIMEOUT = TIMEOUT + TIMEOUT_JITTER;

const ViewersWatchingContainer: FunctionComponent<Props> = ({
  story,
  settings,
  inView = false,
  intersectionRef,
}) => {
  const [lastRefreshed, setLastRefreshed] = useState<number>(Date.now());
  const [refreshed, setRefreshed] = useState(false);
  const live = useLive({ story, settings });
  const visible = useVisibilityState();
  const refreshStoryViewerCount = useFetch(RefreshStoryViewerCount);

  // refresh will refresh the viewer count by refetching the data via the Graph.
  const refresh = useCallback(async () => {
    try {
      // Refresh the viewer count!
      await refreshStoryViewerCount({ storyID: story.id });

      // Mark that we've refreshed (so we remove the extra +1).
      setRefreshed(true);

      // Mark the current date so it'll schedule the next timeout to run in the
      // following useEffect.
      setLastRefreshed(Date.now());
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("couldn not refresh the story viewer count:", err);
      }
    }
  }, [refreshStoryViewerCount, story.id]);

  // available will be true when the viewer count is available.
  const available = story.viewerCount !== null;

  useEffect(() => {
    // If we aren't live, or there isn't a live count available (like if the
    // feature flag isn't enabled), then we don't have to do anything! If the
    // element isn't visible or the page isn't in the foreground, also halt
    // updates.
    if (!live || !available || !visible || !inView) {
      return;
    }

    // Get the time between now and the last time we updated. This addresses the
    // issue where the timer was cleared and not reset because it was out of
    // view so it'll fire right now.
    const lastRefreshedDiff = Date.now() - lastRefreshed;
    if (lastRefreshedDiff >= MAX_TIMEOUT) {
      // The difference was greater than the max timeout. Fire the refresh right
      // now.
      void refresh();
      return;
    }

    const timeout = window.setTimeout(
      refresh,
      // Start with the max timeout...
      MAX_TIMEOUT -
        // Then subtract the difference from the last refresh date...
        lastRefreshedDiff +
        // And add a random jitter to help spread out the calls.
        Math.floor(Math.random() * TIMEOUT_JITTER)
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    live,
    story.id,
    refreshStoryViewerCount,
    visible,
    available,
    inView,
    lastRefreshed,
    refresh,
  ]);

  // If we aren't live or the viewer count isn't available, then return nothing!
  if (!live || story.viewerCount === null) {
    return null;
  }

  // We always add one for the current viewer!
  const viewerCount = refreshed ? story.viewerCount : story.viewerCount + 1;

  return (
    <div ref={intersectionRef}>
      <CallOut
        classes={{ icon: styles.icon, title: styles.title }}
        icon={<Icon size="md">play_circle_filled</Icon>}
        title={
          <Localized id="comments-watchers" $count={viewerCount}>
            <span>{viewerCount} people is online</span>
          </Localized>
        }
        titleWeight="semiBold"
      />
    </div>
  );
};

const enhanced = withInView(
  withFragmentContainer<Props>({
    story: graphql`
      fragment ViewersWatchingContainer_story on Story {
        id
        viewerCount
        isClosed
        settings {
          live {
            enabled
          }
        }
      }
    `,
    settings: graphql`
      fragment ViewersWatchingContainer_settings on Settings {
        disableCommenting {
          enabled
        }
      }
    `,
  })(ViewersWatchingContainer)
);

export default enhanced;
