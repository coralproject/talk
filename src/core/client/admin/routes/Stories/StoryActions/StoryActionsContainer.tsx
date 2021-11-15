import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { Ability, can } from "coral-admin/permissions";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLSTORY_MODE, GQLSTORY_STATUS } from "coral-framework/schema";

import { StoryActionsContainer_story } from "coral-admin/__generated__/StoryActionsContainer_story.graphql";
import { StoryActionsContainer_viewer } from "coral-admin/__generated__/StoryActionsContainer_viewer.graphql";

import ArchiveStoriesMutation from "./ArchiveStoriesMutation";
import CloseStoryMutation from "./CloseStoryMutation";
import OpenStoryMutation from "./OpenStoryMutation";
import RescrapeStoryMutation from "./RescrapeStoryMutation";
import StoryActions from "./StoryActions";
import UnarchiveStoriesMutation from "./UnarchiveStoriesMutation";

interface Props {
  story: StoryActionsContainer_story;
  viewer: StoryActionsContainer_viewer;
}

const StoryActionsContainer: FunctionComponent<Props> = (props) => {
  const rescrape = useMutation(RescrapeStoryMutation);
  const closeStory = useMutation(CloseStoryMutation);
  const openStory = useMutation(OpenStoryMutation);
  const archiveStories = useMutation(ArchiveStoriesMutation);
  const unarchiveStories = useMutation(UnarchiveStoriesMutation);

  const onRescrape = useCallback(() => {
    void rescrape({ id: props.story.id });
  }, [props.story.id, rescrape]);
  const onClose = useCallback(() => {
    void closeStory({ id: props.story.id });
  }, [closeStory, props.story.id]);
  const onOpen = useCallback(() => {
    void openStory({ id: props.story.id });
  }, [openStory, props.story.id]);
  const onArchive = useCallback(() => {
    void archiveStories({ storyIDs: [props.story.id] });
  }, [archiveStories, props.story.id]);
  const onUnarchive = useCallback(() => {
    void unarchiveStories({ storyIDs: [props.story.id] });
  }, [props.story.id, unarchiveStories]);

  const canChangeStatus = can(props.viewer, Ability.CHANGE_STORY_STATUS);
  const viewCanArchive = can(props.viewer, Ability.ARCHIVE_STORY);
  return (
    <StoryActions
      onRescrape={onRescrape}
      onClose={onClose}
      onOpen={onOpen}
      onArchive={onArchive}
      onUnarchive={onUnarchive}
      canClose={props.story.status === GQLSTORY_STATUS.OPEN && canChangeStatus}
      canOpen={
        props.story.status === GQLSTORY_STATUS.CLOSED &&
        canChangeStatus &&
        !props.story.isArchived &&
        !props.story.isArchiving
      }
      canArchive={
        viewCanArchive &&
        !props.story.isArchiving &&
        !props.story.isArchived &&
        props.story.settings?.mode !== GQLSTORY_MODE.RATINGS_AND_REVIEWS
      }
      canUnarchive={
        props.story.status === GQLSTORY_STATUS.CLOSED &&
        viewCanArchive &&
        !props.story.isArchiving &&
        props.story.isArchived
      }
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
      isArchived
      isArchiving
      settings {
        mode
      }
    }
  `,
})(StoryActionsContainer);

export default enhanced;
