import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import CLASSES from "coral-stream/classes";
import {
  Flex,
  HorizontalGutter,
  Icon,
  RelativeTime,
} from "coral-ui/components/v2";

import { StoryRowContainer_story$key as StoryRowContainer_story } from "coral-stream/__generated__/StoryRowContainer_story.graphql";

import styles from "./StoryRowContainer.css";

interface Props {
  story: StoryRowContainer_story;
  currentSiteID: string;
}

const StoryRowContainer: FunctionComponent<Props> = ({
  story,
  currentSiteID,
}) => {
  const storyData = useFragment(
    graphql`
      fragment StoryRowContainer_story on Story {
        site {
          id
          name
        }
        id
        url
        metadata {
          title
          publishedAt
        }
        commentCounts {
          totalPublished
        }
      }
    `,
    story
  );

  return (
    <a href={storyData.url} className={styles.root} target="_parent">
      <HorizontalGutter spacing={1}>
        {currentSiteID !== storyData.site.id && (
          <p
            className={cn(styles.siteName, CLASSES.discussions.story.siteName)}
          >
            {storyData.site.name}
          </p>
        )}
        {storyData.metadata && storyData.metadata.title && (
          <h3
            className={cn(styles.storyTitle, CLASSES.discussions.story.header)}
          >
            {storyData.metadata.title}
          </h3>
        )}
        <Flex spacing={3}>
          {storyData.metadata && storyData.metadata.publishedAt && (
            <RelativeTime
              date={storyData.metadata.publishedAt}
              className={cn(styles.time, CLASSES.discussions.story.date)}
            />
          )}
          <Flex spacing={1} alignItems="center">
            <Icon
              className={cn(
                styles.commentsCountIcon,
                CLASSES.discussions.story.commentsCountIcon
              )}
            >
              mode_comment
            </Icon>
            <span
              className={cn(
                styles.commentsCount,
                CLASSES.discussions.story.commentsCount
              )}
            >
              {storyData.commentCounts.totalPublished}
            </span>
          </Flex>
        </Flex>
      </HorizontalGutter>
    </a>
  );
};

export default StoryRowContainer;
