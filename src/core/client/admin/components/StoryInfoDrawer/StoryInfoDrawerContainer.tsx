/* eslint-disable */
import React, { FunctionComponent } from "react";

import {
  Flex,
  HorizontalGutter,
  Icon,
  TextLink
} from "coral-ui/components/v2";

import { StoryInfoDrawerQueryResponse as StoryResponse } from "coral-admin/__generated__/StoryInfoDrawerQuery.graphql";

import StoryStatus from "./StoryStatus";
import RescrapeStory from "./RescrapeStory";
import { GQLSTORY_STATUS } from "coral-framework/schema";

import styles from "./StoryInfoDrawerContainer.css";

export interface Props {
  onClose: () => void;
  story: NonNullable<StoryResponse["story"]>;
}

const MetaDataItem: FunctionComponent<{ result: [string, any] }> = ({
  result: [ key, val ]
}) => (
  <Flex direction="row" className={styles.metaDataItem}>
    <div>{key}</div><div>{val}</div>
  </Flex>
);

const StoryInfoDrawerContainer: FunctionComponent<Props> = ({
  story,
  onClose,
}) => {
  // TODO: localize!
  return (
    <HorizontalGutter spacing={4} className={styles.root}>
      <Flex justifyContent="flex-start">
        <Flex direction="column">
          <span className={styles.sectionTitle}>
            Story Details {/* TODO: dynamically make all caps for localization */}
          </span>
          <h2 className={styles.storyTitle}>
            {story.metadata?.title || "Untitled"}
          </h2>
          <TextLink href={story.url}>{story.url}</TextLink>
          <Flex direction="row" alignItems="center" className={styles.status}>
            STATUS: <StoryStatus
              storyID={story.id}
              currentStatus={story.status as GQLSTORY_STATUS}
            />
          </Flex>
          <Flex direction="column" className={styles.publishInfoSection}>
            <Flex direction="row" className={styles.publishInfo}>
              <Icon className={styles.icon} size="md">supervisor_account</Icon>
              {story.metadata?.author} {/* TODO: handle no author */}
            </Flex>
            <Flex direction="row" className={styles.publishInfo}>
              <Icon className={styles.icon} size="md">calendar_today</Icon>
              {story.metadata?.publishedAt} {/* format */}
            </Flex>
          </Flex>
          <span className={styles.sectionTitle}>Scraped Metadata</span>
          <Flex className={styles.metaData} direction="column">
            {
              Object.entries(story.metadata as object)
                .filter(( [ , val ] ) => typeof val !== 'function' )
                .map((result) => <MetaDataItem result={result} />)
            }
          </Flex>
          <RescrapeStory storyID={story.id} />
        </Flex>
      </Flex>
    </HorizontalGutter>
  );
};

export default StoryInfoDrawerContainer;
