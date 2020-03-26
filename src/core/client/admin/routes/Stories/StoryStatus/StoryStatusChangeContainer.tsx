import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { Ability, can } from "coral-admin/permissions";
import {
  MutationProp,
  withFragmentContainer,
  withMutation,
} from "coral-framework/lib/relay";
import { GQLSTORY_STATUS, GQLSTORY_STATUS_RL } from "coral-framework/schema";

import { StoryStatusChangeContainer_story } from "coral-admin/__generated__/StoryStatusChangeContainer_story.graphql";
import { StoryStatusChangeContainer_viewer } from "coral-admin/__generated__/StoryStatusChangeContainer_viewer.graphql";

import CloseStoryMutation from "./CloseStoryMutation";
import OpenStoryMutation from "./OpenStoryMutation";
import StoryStatusChange from "./StoryStatusChange";
import StoryStatusText from "./StoryStatusText";

interface Props {
  openStory: MutationProp<typeof OpenStoryMutation>;
  closeStory: MutationProp<typeof CloseStoryMutation>;
  viewer: StoryStatusChangeContainer_viewer;
  story: StoryStatusChangeContainer_story;
}

const StoryStatusChangeContainer: FunctionComponent<Props> = (props) => {
  const handleChangeStatus = useCallback(
    (status: GQLSTORY_STATUS_RL) => {
      if (props.story.status === status) {
        return;
      }
      if (status === GQLSTORY_STATUS.CLOSED) {
        props.closeStory({ id: props.story.id });
      } else if (status === GQLSTORY_STATUS.OPEN) {
        props.openStory({ id: props.story.id });
      }
    },
    [props.story.id, props.closeStory, props.openStory, props.story.status]
  );

  const canChangeStatus = can(props.viewer, Ability.CHANGE_STORY_STATUS);

  if (!canChangeStatus) {
    return <StoryStatusText>{props.story.status}</StoryStatusText>;
  }

  return (
    <StoryStatusChange
      onChangeStatus={handleChangeStatus}
      status={props.story.status}
    />
  );
};

const enhanced = withMutation(OpenStoryMutation)(
  withMutation(CloseStoryMutation)(
    withFragmentContainer<Props>({
      viewer: graphql`
        fragment StoryStatusChangeContainer_viewer on User {
          id
          role
        }
      `,
      story: graphql`
        fragment StoryStatusChangeContainer_story on Story {
          id
          status
        }
      `,
    })(StoryStatusChangeContainer)
  )
);

export default enhanced;
