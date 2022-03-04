import React, { FunctionComponent, useEffect } from "react";
import { graphql, useFragment } from "react-relay";

import { SectionFilter } from "coral-common/section";
import { combineDisposables, useSubscription } from "coral-framework/lib/relay";

import { ModerateNavigationContainer_moderationQueues$key as ModerationQueuesData } from "coral-admin/__generated__/ModerateNavigationContainer_moderationQueues.graphql";
import { ModerateNavigationContainer_settings$key as SettingsData } from "coral-admin/__generated__/ModerateNavigationContainer_settings.graphql";
import { ModerateNavigationContainer_story$key as StoryData } from "coral-admin/__generated__/ModerateNavigationContainer_story.graphql";

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

const ModerateNavigationContainer: FunctionComponent<Props> = ({
  moderationQueues,
  settings,
  story,
  siteID,
  section,
}) => {
  const moderationQueuesData = useFragment(
    graphql`
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
    moderationQueues
  );
  const settingsData = useFragment(
    graphql`
      fragment ModerateNavigationContainer_settings on Settings {
        moderation
        forReviewQueue
      }
    `,
    settings
  );
  const storyData = useFragment(
    graphql`
      fragment ModerateNavigationContainer_story on Story {
        id
        isArchiving
        isArchived
      }
    `,
    story
  );

  const subscribeToCommentEntered = useSubscription(
    ModerateCountsCommentEnteredSubscription
  );
  const subscribeToCommentLeft = useSubscription(
    ModerateCountsCommentLeftSubscription
  );

  const shouldSubscribe = moderationQueuesData && !section;
  useEffect(() => {
    if (!shouldSubscribe) {
      return;
    }
    const vars = {
      storyID: storyData && storyData.id,
      siteID,
    };
    const disposable = combineDisposables(
      subscribeToCommentEntered(vars),
      subscribeToCommentLeft(vars)
    );
    return () => {
      disposable.dispose();
    };
  }, [
    siteID,
    shouldSubscribe,
    subscribeToCommentEntered,
    subscribeToCommentLeft,
    storyData,
  ]);

  const storyIsArchived = storyData?.isArchived || storyData?.isArchiving;

  if (!moderationQueuesData) {
    return <Navigation />;
  }
  return (
    <Navigation
      unmoderatedCount={
        storyIsArchived ? 0 : moderationQueuesData.unmoderated.count
      }
      reportedCount={storyIsArchived ? 0 : moderationQueuesData.reported.count}
      pendingCount={storyIsArchived ? 0 : moderationQueuesData.pending.count}
      storyID={storyData && storyData.id}
      siteID={siteID}
      section={section}
      mode={settingsData?.moderation}
      enableForReview={settingsData?.forReviewQueue}
    />
  );
};

export default ModerateNavigationContainer;
