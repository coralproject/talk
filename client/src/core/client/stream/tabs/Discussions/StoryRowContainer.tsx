import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import {
  Flex,
  HorizontalGutter,
  Icon,
  RelativeTime,
} from "coral-ui/components/v2";

import { StoryRowContainer_story } from "coral-stream/__generated__/StoryRowContainer_story.graphql";

import styles from "./StoryRowContainer.css";

interface Props {
  story: StoryRowContainer_story;
  currentSiteID: string;
}

const StoryRowContainer: FunctionComponent<Props> = ({
  story,
  currentSiteID,
}) => {
  return (
    <a href={story.url} className={styles.root} target="_parent">
      <HorizontalGutter spacing={1}>
        {currentSiteID !== story.site.id && (
          <p
            className={cn(styles.siteName, CLASSES.discussions.story.siteName)}
          >
            {story.site.name}
          </p>
        )}
        {story.metadata && story.metadata.title && (
          <h3
            className={cn(styles.storyTitle, CLASSES.discussions.story.header)}
          >
            {story.metadata.title}
          </h3>
        )}
        <Flex spacing={3}>
          {story.metadata && story.metadata.publishedAt && (
            <RelativeTime
              date={story.metadata.publishedAt}
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
              {story.commentCounts.totalPublished}
            </span>
          </Flex>
        </Flex>
      </HorizontalGutter>
    </a>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
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
})(StoryRowContainer);

export default enhanced;
