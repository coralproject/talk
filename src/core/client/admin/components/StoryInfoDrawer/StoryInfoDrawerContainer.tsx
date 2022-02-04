import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "relay-runtime";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLSTORY_STATUS } from "coral-framework/schema";
import {
  Flex,
  HorizontalGutter,
  Icon,
  TextLink,
  Timestamp,
} from "coral-ui/components/v2";
import ArchivedMarker from "coral-ui/components/v3/ArchivedMarker/ArchivedMarker";

import { StoryInfoDrawerContainer_story } from "coral-admin/__generated__/StoryInfoDrawerContainer_story.graphql";
import { StoryInfoDrawerContainer_viewer } from "coral-admin/__generated__/StoryInfoDrawerContainer_viewer.graphql";

import ArchiveStory from "./ArchiveStory";
import RescrapeStory from "./RescrapeStory";
import styles from "./StoryInfoDrawerContainer.css";
import StorySettingsContainer from "./StorySettingsContainer";
import StoryStatus from "./StoryStatus";

export interface Props {
  onClose: () => void;
  story: StoryInfoDrawerContainer_story;
  viewer: StoryInfoDrawerContainer_viewer | null;
}

const MetaDataItem: FunctionComponent<{ val: any; icon: any }> = ({
  val,
  icon,
}) => {
  return (
    <Flex direction="row" className={styles.metaDataItem}>
      <div>{icon}</div>
      <div>{val}</div>
    </Flex>
  );
};

const StoryInfoDrawerContainer: FunctionComponent<Props> = ({
  story,
  viewer,
  onClose,
}) => {
  const { author, publishedAt } = story.metadata || {};

  return (
    <HorizontalGutter spacing={4} className={styles.root}>
      <Flex justifyContent="flex-start">
        <Flex direction="column">
          <Localized id="storyInfoDrawer-title">
            <span className={styles.sectionTitle}>Story Details</span>
          </Localized>
          <h2 className={styles.storyTitle}>
            {story.metadata?.title ? (
              story.metadata.title
            ) : (
              <Localized id="storyInfoDrawer-titleNotAvailable">
                Title not available
              </Localized>
            )}
          </h2>
          <TextLink className={styles.storyLink} href={story.url}>
            {story.url}
          </TextLink>
          <Flex direction="row" alignItems="center" className={styles.status}>
            {story.isArchived || story.isArchiving ? (
              <>
                <ArchivedMarker />
                {viewer && <ArchiveStory story={story} viewer={viewer} />}
              </>
            ) : (
              <StoryStatus
                storyID={story.id}
                currentStatus={story.status as GQLSTORY_STATUS}
              />
            )}
          </Flex>
          <Localized id="storyInfoDrawer-scrapedMetaData">
            <span className={styles.sectionTitle}>Scraped Metadata</span>
          </Localized>
          <Flex className={styles.metaData} direction="column">
            {author && (
              <MetaDataItem
                key="author"
                val={author}
                icon={<Icon size="sm">people</Icon>}
              />
            )}
            {publishedAt && (
              <MetaDataItem
                key="publishedAt"
                val={<Timestamp>{publishedAt}</Timestamp>}
                icon={<Icon size="sm">calendar_today</Icon>}
              />
            )}
          </Flex>
          <RescrapeStory storyID={story.id} />
          {viewer && <ArchiveStory story={story} viewer={viewer} />}
          <StorySettingsContainer
            settings={story.settings}
            storyID={story.id}
          />
        </Flex>
      </Flex>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment StoryInfoDrawerContainer_story on Story {
      id
      url
      status
      scrapedAt
      isArchived
      isArchiving
      metadata {
        title
        author
        publishedAt
      }
      settings {
        ...StorySettingsContainer_storySettings
      }
      ...ArchiveStory_story
    }
  `,
  viewer: graphql`
    fragment StoryInfoDrawerContainer_viewer on User {
      ...ArchiveStory_viewer
    }
  `,
})(StoryInfoDrawerContainer);

export default enhanced;
