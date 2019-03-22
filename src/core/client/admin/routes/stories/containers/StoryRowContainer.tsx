import React, { StatelessComponent } from "react";
import { graphql } from "react-relay";

import { StoryRowContainer_story as StoryData } from "talk-admin/__generated__/StoryRowContainer_story.graphql";
import { StoryRowContainer_viewer as ViewerData } from "talk-admin/__generated__/StoryRowContainer_viewer.graphql";
import { useTalkContext } from "talk-framework/lib/bootstrap";
import { withFragmentContainer } from "talk-framework/lib/relay";

import { Ability, can } from "talk-admin/permissions";
import StoryRow from "../components/StoryRow";

interface Props {
  story: StoryData;
  viewer: ViewerData;
}

const StoryRowContainer: StatelessComponent<Props> = props => {
  const { locales } = useTalkContext();
  const title = props.story.metadata && props.story.metadata.title;
  const author = props.story.metadata && props.story.metadata.author;
  const publishedAt = props.story.metadata && props.story.metadata.publishedAt;
  return (
    <StoryRow
      storyID={props.story.id}
      title={title}
      author={author}
      publishDate={
        publishedAt
          ? new Intl.DateTimeFormat(locales, {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }).format(new Date(publishedAt))
          : null
      }
      status={props.story.status}
      canChangeStatus={
        props.viewer.id !== props.story.id &&
        can(props.viewer, Ability.CHANGE_STORY_STATUS)
      }
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment StoryRowContainer_viewer on User {
      id
      role
    }
  `,
  story: graphql`
    fragment StoryRowContainer_story on Story {
      id
      metadata {
        title
        author
        publishedAt
      }
      isClosed
      status
    }
  `,
})(StoryRowContainer);

export default enhanced;
