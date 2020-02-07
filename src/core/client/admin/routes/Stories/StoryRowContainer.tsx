import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { StoryRowContainer_story as StoryData } from "coral-admin/__generated__/StoryRowContainer_story.graphql";
import { StoryRowContainer_viewer as ViewerData } from "coral-admin/__generated__/StoryRowContainer_viewer.graphql";

import StoryRow from "./StoryRow";

interface Props {
  story: StoryData;
  viewer: ViewerData;
  multisite: boolean;
}

const StoryRowContainer: FunctionComponent<Props> = props => {
  const { locales } = useCoralContext();
  const title = props.story.metadata && props.story.metadata.title;
  const author = props.story.metadata && props.story.metadata.author;
  const publishedAt = props.story.metadata && props.story.metadata.publishedAt;
  return (
    <StoryRow
      storyID={props.story.id}
      title={title}
      author={author}
      story={props.story}
      viewer={props.viewer}
      siteName={props.story.site.name}
      siteID={props.story.site.id}
      multisite={props.multisite}
      totalCount={props.story.commentCounts.totalPublished}
      reportedCount={props.story.moderationQueues.reported.count}
      pendingCount={props.story.moderationQueues.pending.count}
      publishDate={
        publishedAt
          ? new Intl.DateTimeFormat(locales, {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour12: true,
              hour: "numeric",
              minute: "2-digit",
            }).format(new Date(publishedAt))
          : null
      }
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment StoryRowContainer_viewer on User {
      id
      ...StoryStatusChangeContainer_viewer
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
      commentCounts {
        totalPublished
      }
      moderationQueues {
        reported {
          count
        }
        pending {
          count
        }
      }
      site {
        name
        id
      }
      isClosed
      ...StoryStatusChangeContainer_story
    }
  `,
})(StoryRowContainer);

export default enhanced;
