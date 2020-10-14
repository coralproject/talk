import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { StoryRowContainer_story as StoryData } from "coral-admin/__generated__/StoryRowContainer_story.graphql";
import { StoryRowContainer_viewer as ViewerData } from "coral-admin/__generated__/StoryRowContainer_viewer.graphql";

import StoryRow from "./StoryRow";

interface Props {
  story: StoryData;
  viewer: ViewerData;
  multisite: boolean;
}

const StoryRowContainer: FunctionComponent<Props> = (props) => {
  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });

  const title = props.story.metadata && props.story.metadata.title;
  const author = props.story.metadata && props.story.metadata.author;
  const publishedAt = useMemo(() => {
    if (!props.story.metadata || !props.story.metadata.publishedAt) {
      return null;
    }

    return formatter(props.story.metadata.publishedAt);
  }, [props.story, formatter]);

  // A story is readOnly if the viewer can't moderate it.
  const readOnly = !props.story.canModerate;

  return (
    <StoryRow
      readOnly={readOnly}
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
      publishDate={publishedAt}
      viewerCount={props.story.viewerCount}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment StoryRowContainer_viewer on User {
      id
      ...StoryActionsContainer_viewer
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
      viewerCount
      site {
        name
        id
      }
      canModerate
      isClosed
      ...StoryActionsContainer_story
      ...StoryStatusContainer_story
    }
  `,
})(StoryRowContainer);

export default enhanced;
