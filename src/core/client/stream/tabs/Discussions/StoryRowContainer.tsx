import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, Icon, RelativeTime } from "coral-ui/components/v2";

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
    <div>
      <a href={story.url}>
        {currentSiteID !== story.site.id && (
          <p className={styles.siteName}>{story.site.name}</p>
        )}
        {story.metadata && story.metadata.title && (
          <h3 className={styles.storyTitle}>{story.metadata.title}</h3>
        )}
        {(!story.metadata || !story.metadata.title) && <h3>N/A</h3>}
        <Flex>
          {story.metadata && story.metadata.publishedAt && (
            <RelativeTime date={story.metadata.publishedAt} />
          )}
          <Flex className={styles.commentsCount}>
            <Icon>mode_comment</Icon>
            <span>{story.commentCounts.totalPublished}</span>
          </Flex>
        </Flex>
      </a>
    </div>
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
