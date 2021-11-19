import React, { useEffect } from "react";
import { graphql } from "react-relay";

import { SectionFilter } from "coral-common/section";
import {
  combineDisposables,
  useSubscription,
  withFragmentContainer,
} from "coral-framework/lib/relay";

import { ModerateNavigationContainer_moderationQueues as ModerationQueuesData } from "coral-admin/__generated__/ModerateNavigationContainer_moderationQueues.graphql";
import { ModerateNavigationContainer_settings as SettingsData } from "coral-admin/__generated__/ModerateNavigationContainer_settings.graphql";
import { ModerateNavigationContainer_story as StoryData } from "coral-admin/__generated__/ModerateNavigationContainer_story.graphql";

import ModerateCountsCommentEnteredSubscription from "./ModerateCountsCommentEnteredSubscription";
import ModerateCountsCommentLeftSubscription from "./ModerateCountsCommentLeftSubscription";
import Navigation from "./Navigation";

interface Props {
  moderationQueues: ModerationQueuesData | null;
  settings: SettingsData | null;
  story: StoryData | null;
  siteID: string | null;
  section?: SectionFilter | null;
}

const ModerateNavigationContainer: React.FunctionComponent<Props> = (props) => {
  const subscribeToCommentEntered = useSubscription(
    ModerateCountsCommentEnteredSubscription
  );
  const subscribeToCommentLeft = useSubscription(
    ModerateCountsCommentLeftSubscription
  );

  const shouldSubscribe = props.moderationQueues && !props.section;
  useEffect(() => {
    if (!shouldSubscribe) {
      return;
    }
    const vars = {
      storyID: props.story && props.story.id,
      siteID: props.siteID,
    };
    const disposable = combineDisposables(
      subscribeToCommentEntered(vars),
      subscribeToCommentLeft(vars)
    );
    return () => {
      disposable.dispose();
    };
  }, [
    props.story,
    props.siteID,
    shouldSubscribe,
    subscribeToCommentEntered,
    subscribeToCommentLeft,
  ]);

  const storyIsArchived = props.story?.isArchived || props.story?.isArchiving;

  if (!props.moderationQueues) {
    return <Navigation />;
  }
  return (
    <Navigation
      unmoderatedCount={
        storyIsArchived ? 0 : props.moderationQueues.unmoderated.count
      }
      reportedCount={
        storyIsArchived ? 0 : props.moderationQueues.reported.count
      }
      pendingCount={storyIsArchived ? 0 : props.moderationQueues.pending.count}
      storyID={props.story && props.story.id}
      siteID={props.siteID}
      section={props.section}
      mode={props.settings?.moderation}
      enableForReview={props.settings?.forReviewQueue}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment ModerateNavigationContainer_story on Story {
      id
      isArchiving
      isArchived
    }
  `,
  settings: graphql`
    fragment ModerateNavigationContainer_settings on Settings {
      moderation
      forReviewQueue
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
