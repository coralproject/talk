import React, { useEffect } from "react";
import { graphql } from "react-relay";

import {
  combineDisposables,
  useSubscription,
  withFragmentContainer,
} from "coral-framework/lib/relay";

import { ModerateNavigationContainer_moderationQueues as ModerationQueuesData } from "coral-admin/__generated__/ModerateNavigationContainer_moderationQueues.graphql";
import { ModerateNavigationContainer_site as SiteData } from "coral-admin/__generated__/ModerateNavigationContainer_site.graphql";
import { ModerateNavigationContainer_story as StoryData } from "coral-admin/__generated__/ModerateNavigationContainer_story.graphql";

import ModerateCountsCommentEnteredSubscription from "./ModerateCountsCommentEnteredSubscription";
import ModerateCountsCommentLeftSubscription from "./ModerateCountsCommentLeftSubscription";
import Navigation from "./Navigation";

interface Props {
  moderationQueues: ModerationQueuesData | null;
  story: StoryData | null;
  site: SiteData | null;
}

const ModerateNavigationContainer: React.FunctionComponent<Props> = props => {
  const subscribeToCommentEntered = useSubscription(
    ModerateCountsCommentEnteredSubscription
  );
  const subscribeToCommentLeft = useSubscription(
    ModerateCountsCommentLeftSubscription
  );

  useEffect(() => {
    if (!props.moderationQueues) {
      return;
    }
    const vars = {
      storyID: props.story && props.story.id,
      siteID: props.site && props.site.id,
    };
    const disposable = combineDisposables(
      subscribeToCommentEntered(vars),
      subscribeToCommentLeft(vars)
    );
    return () => {
      disposable.dispose();
    };
  }, [Boolean(props.moderationQueues), props.story, props.site]);

  if (!props.moderationQueues) {
    return <Navigation />;
  }
  return (
    <Navigation
      unmoderatedCount={props.moderationQueues.unmoderated.count}
      reportedCount={props.moderationQueues.reported.count}
      pendingCount={props.moderationQueues.pending.count}
      storyID={props.story && props.story.id}
      siteID={props.site && props.site.id}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment ModerateNavigationContainer_story on Story {
      id
    }
  `,
  site: graphql`
    fragment ModerateNavigationContainer_site on Site {
      id
    }
  `,
  moderationQueues: graphql`
    fragment ModerateNavigationContainer_moderationQueues on ModerationQueues {
      unmoderated {
        count
      }
      reported {
        count
      }
      pending {
        count
      }
    }
  `,
})(ModerateNavigationContainer);

export default enhanced;
