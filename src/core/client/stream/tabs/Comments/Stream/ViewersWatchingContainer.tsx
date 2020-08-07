import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useLive } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { ViewersWatchingContainer_settings } from "coral-stream/__generated__/ViewersWatchingContainer_settings.graphql";
import { ViewersWatchingContainer_story } from "coral-stream/__generated__/ViewersWatchingContainer_story.graphql";

import styles from "./ViewersWatchingContainer.css";

interface Props {
  story: ViewersWatchingContainer_story;
  settings: ViewersWatchingContainer_settings;
}

const ViewersWatchingContainer: FunctionComponent<Props> = ({
  story,
  settings,
}) => {
  const live = useLive({ story, settings });
  if (!live) {
    return null;
  }

  // We always add one for the current viewer!
  const viewerCount = story.viewerCount + 1;

  return (
    <CallOut
      classes={{ icon: styles.icon, title: styles.title }}
      icon={<Icon size="md">play_circle_filled</Icon>}
      title={
        <Localized id="comments-watchers" $count={viewerCount}>
          <span>{viewerCount} people are here</span>
        </Localized>
      }
      titleWeight="semiBold"
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment ViewersWatchingContainer_story on Story {
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
