import React, { FunctionComponent, useMemo } from "react";
import { graphql, useFragment } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";

import { StoryRowContainer_story$key as StoryData } from "coral-admin/__generated__/StoryRowContainer_story.graphql";

import StoryRow from "./StoryRow";

interface Props {
  story: StoryData;
  multisite: boolean;
  onOpenInfoDrawer: () => void;
}

const StoryRowContainer: FunctionComponent<Props> = ({
  story,
  multisite,
  onOpenInfoDrawer,
}) => {
  const storyData = useFragment(
    graphql`
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
        ...StoryStatusContainer_story
      }
    `,
    story
  );

  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });

  const title = storyData.metadata && storyData.metadata.title;
  const author = storyData.metadata && storyData.metadata.author;
  const publishedAt = useMemo(() => {
    if (!storyData.metadata || !storyData.metadata.publishedAt) {
      return null;
    }

    return formatter(storyData.metadata.publishedAt);
  }, [storyData, formatter]);

  // A story is readOnly if the viewer can't moderate it.
  const readOnly = !storyData.canModerate;

  return (
    <StoryRow
      readOnly={readOnly}
      storyID={storyData.id}
      title={title}
      author={author}
      story={storyData}
      siteName={storyData.site.name}
      siteID={storyData.site.id}
      multisite={multisite}
      totalCount={storyData.commentCounts.totalPublished}
      reportedCount={storyData.moderationQueues.reported.count}
      pendingCount={storyData.moderationQueues.pending.count}
      publishDate={publishedAt}
      viewerCount={storyData.viewerCount}
      onOpenInfoDrawer={onOpenInfoDrawer}
    />
  );
};

export default StoryRowContainer;
