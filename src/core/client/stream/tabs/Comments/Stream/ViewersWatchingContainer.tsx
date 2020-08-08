import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { graphql } from "react-relay";

import { useLive, useVisibilityState } from "coral-framework/hooks";
import { useFetch, withFragmentContainer } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { ViewersWatchingContainer_settings } from "coral-stream/__generated__/ViewersWatchingContainer_settings.graphql";
import { ViewersWatchingContainer_story } from "coral-stream/__generated__/ViewersWatchingContainer_story.graphql";

import RefreshStoryViewerCount from "./RefreshStoryViewerCount";

import styles from "./ViewersWatchingContainer.css";

interface Props {
  story: ViewersWatchingContainer_story;
  settings: ViewersWatchingContainer_settings;
}

const TIMEOUT = 20000;
const JITTER = 10000;
function getTimeout() {
  return TIMEOUT + Math.floor(Math.random() * JITTER);
}

const ViewersWatchingContainer: FunctionComponent<Props> = ({
  story,
  settings,
}) => {
  const [refreshed, setRefreshed] = useState(false);
  const live = useLive({ story, settings });
  const visible = useVisibilityState();
  const refreshStoryViewerCount = useFetch(RefreshStoryViewerCount);

  // available will be true when the viewer count is available.
  const available = story.viewerCount !== null;

  useEffect(() => {
    // If we aren't live, we can't refresh the count cause there can't be any!
    if (!live || !visible || !available) {
      return;
    }

    // Setup a timeout to be re-used.
    let timeout: number | null = null;
    let disposed = false;

    // Create a function that can be used to refresh the story viewer count.
    const refresh = async () => {
      try {
        // Refresh the viewer count!
        await refreshStoryViewerCount({ storyID: story.id });

        // If we're disposed, then stop now!
        if (disposed) {
          return;
        }

        // Mark that we've refreshed (so we remove the extra +1).
        setRefreshed(true);

        // Add this back with a timeout if we aren't disposed.
        timeout = window.setTimeout(refresh, getTimeout());
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("couldn not refresh the story viewer count:", err);
        }
      }
    };

    // Configure a timeout to fire later to refresh.
    timeout = window.setTimeout(refresh, getTimeout());

    // Clear the timeout when we dispose.
    return () => {
      // Clear the timeout if it's still running.
      if (timeout) {
        window.clearTimeout(timeout);
      }

      // Mark this as disposed so we don't update state after a refresh.
      disposed = true;
    };
  }, [live, story.id, refreshStoryViewerCount, visible, available]);

  // If we aren't live or the viewer count isn't available, then return nothing!
  if (!live || story.viewerCount === null) {
    return null;
  }

  // We always add one for the current viewer!
  const viewerCount = refreshed ? story.viewerCount : story.viewerCount + 1;

  return (
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
  );
};

const enhanced = withFragmentContainer<Props>({
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
})(ViewersWatchingContainer);

export default enhanced;
