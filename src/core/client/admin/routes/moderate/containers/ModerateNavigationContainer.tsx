import React from "react";
import { graphql } from "react-relay";

import { ModerateNavigationContainer_moderationQueues as ModerationQueuesData } from "coral-admin/__generated__/ModerateNavigationContainer_moderationQueues.graphql";
import { ModerateNavigationContainer_story as StoryData } from "coral-admin/__generated__/ModerateNavigationContainer_story.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import Navigation from "../components/Navigation";

interface Props {
  moderationQueues: ModerationQueuesData | null;
  story: StoryData | null;
}

const ModerateNavigationContainer: React.FunctionComponent<Props> = props => {
  if (!props.moderationQueues) {
    return <Navigation />;
  }
  return (
    <Navigation
      unmoderatedCount={props.moderationQueues.unmoderated.count}
      reportedCount={props.moderationQueues.reported.count}
      pendingCount={props.moderationQueues.pending.count}
      storyID={props.story && props.story.id}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment ModerateNavigationContainer_story on Story {
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
