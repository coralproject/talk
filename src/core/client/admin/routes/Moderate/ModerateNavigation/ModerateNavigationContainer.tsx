import React, { useEffect } from "react";
import { graphql } from "react-relay";

import { SectionFilter } from "coral-common/section";
import {
  combineDisposables,
  useSubscription,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";

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

  if (!props.moderationQueues) {
    return <Navigation />;
  }
  return (
    <Navigation
      unmoderatedCount={props.moderationQueues.unmoderated.count}
      reportedCount={props.moderationQueues.reported.count}
      pendingCount={props.moderationQueues.pending.count}
      storyID={props.story && props.story.id}
      siteID={props.siteID}
      section={props.section}
      mode={props.settings?.moderation}
      enableForReview={props.settings?.featureFlags.includes(
        GQLFEATURE_FLAG.FOR_REVIEW
      )}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment ModerateNavigationContainer_story on Story {
      id
    }
  `,
  settings: graphql`
    fragment ModerateNavigationContainer_settings on Settings {
      moderation
      featureFlags
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
