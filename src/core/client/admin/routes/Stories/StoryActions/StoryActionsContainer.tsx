import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { Ability, can } from "coral-admin/permissions";
import { GQLSTORY_STATUS } from "coral-admin/schema";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";

import { StoryActionsContainer_story } from "coral-admin/__generated__/StoryActionsContainer_story.graphql";
import { StoryActionsContainer_viewer } from "coral-admin/__generated__/StoryActionsContainer_viewer.graphql";

import CloseStoryMutation from "./CloseStoryMutation";
import OpenStoryMutation from "./OpenStoryMutation";
import RescrapeStoryMutation from "./RescrapeStoryMutation";
import StoryActions from "./StoryActions";

interface Props {
  story: StoryActionsContainer_story;
  viewer: StoryActionsContainer_viewer;
}

const StoryActionsContainer: FunctionComponent<Props> = (props) => {
  const rescrape = useMutation(RescrapeStoryMutation);
  const closeStory = useMutation(CloseStoryMutation);
  const openStory = useMutation(OpenStoryMutation);
  const onRescrape = useCallback(() => {
    void rescrape({ id: props.story.id });
  }, [props.story.id]);
  const onClose = useCallback(() => {
    void closeStory({ id: props.story.id });
  }, [props.story.id]);
  const onOpen = useCallback(() => {
    void openStory({ id: props.story.id });
  }, [props.story.id]);
  const canChangeStatus = can(props.viewer, Ability.CHANGE_STORY_STATUS);
  return (
    <StoryActions
      onRescrape={onRescrape}
      onClose={onClose}
      onOpen={onOpen}
      canClose={props.story.status === GQLSTORY_STATUS.OPEN && canChangeStatus}
      canOpen={props.story.status === GQLSTORY_STATUS.CLOSED && canChangeStatus}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment StoryActionsContainer_viewer on User {
      id
      role
    }
  `,
  story: graphql`
    fragment StoryActionsContainer_story on Story {
      id
      status
    }
  `,
})(StoryActionsContainer);

export default enhanced;
