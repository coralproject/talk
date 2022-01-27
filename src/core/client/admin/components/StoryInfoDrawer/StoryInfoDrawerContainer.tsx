import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "relay-runtime";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLSTORY_STATUS } from "coral-framework/schema";
import { Flex, HorizontalGutter, TextLink } from "coral-ui/components/v2";
import ArchivedMarker from "coral-ui/components/v3/ArchivedMarker/ArchivedMarker";

import { StoryInfoDrawerContainer_story } from "coral-admin/__generated__/StoryInfoDrawerContainer_story.graphql";

import RescrapeStory from "./RescrapeStory";
import styles from "./StoryInfoDrawerContainer.css";
import StorySettingsContainer from "./StorySettingsContainer";
import StoryStatus from "./StoryStatus";

export interface Props {
  onClose: () => void;
  story: StoryInfoDrawerContainer_story;
}

const StoryInfoDrawerContainer: FunctionComponent<Props> = ({
  story,
  onClose,
}) => {
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
              <ArchivedMarker />
            ) : (
              <StoryStatus
                storyID={story.id}
                currentStatus={story.status as GQLSTORY_STATUS}
              />
            )}
          </Flex>
          <RescrapeStory storyID={story.id} />
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
    }
  `,
})(StoryInfoDrawerContainer);

export default enhanced;
