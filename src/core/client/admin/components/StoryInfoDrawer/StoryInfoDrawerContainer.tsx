import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

import { GQLSTORY_STATUS } from "coral-framework/schema";
import { Flex, HorizontalGutter, TextLink } from "coral-ui/components/v2";
import ArchivedMarker from "coral-ui/components/v3/ArchivedMarker/ArchivedMarker";

import { StoryInfoDrawerContainer_settings$key as StoryInfoDrawerContainer_settings } from "coral-admin/__generated__/StoryInfoDrawerContainer_settings.graphql";
import { StoryInfoDrawerContainer_story$key as StoryInfoDrawerContainer_story } from "coral-admin/__generated__/StoryInfoDrawerContainer_story.graphql";
import { StoryInfoDrawerContainer_viewer$key as StoryInfoDrawerContainer_viewer } from "coral-admin/__generated__/StoryInfoDrawerContainer_viewer.graphql";

import ArchiveStoryActionsContainer from "./ArchiveStoryActionsContainer";
import ModerateStoryButton from "./ModerateStoryButton";
import RescrapeStory from "./RescrapeStory";
import StorySettingsContainer from "./StorySettingsContainer";
import StoryStatus from "./StoryStatus";

import styles from "./StoryInfoDrawerContainer.css";

export interface Props {
  story: StoryInfoDrawerContainer_story;
  viewer: StoryInfoDrawerContainer_viewer | null;
  settings: StoryInfoDrawerContainer_settings;
}

const StoryInfoDrawerContainer: FunctionComponent<Props> = ({
  story,
  viewer,
  settings,
}) => {
  const storyData = useFragment(
    graphql`
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
        ...ModerateStoryButton_story
        settings {
          ...StorySettingsContainer_storySettings
        }
        ...ArchiveStoryActionsContainer_story
      }
    `,
    story
  );
  const viewerData = useFragment(
    graphql`
      fragment StoryInfoDrawerContainer_viewer on User {
        ...ArchiveStoryActionsContainer_viewer
        ...ModerateStoryButton_viewer
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment StoryInfoDrawerContainer_settings on Settings {
        ...ModerateStoryButton_settings
      }
    `,
    settings
  );

  return (
    <HorizontalGutter spacing={4} className={styles.root}>
      <Flex justifyContent="flex-start">
        <Flex direction="column">
          <Localized id="storyInfoDrawer-title">
            <span className={styles.sectionTitle}>Story Details</span>
          </Localized>
          <h2 className={styles.storyTitle}>
            {storyData.metadata?.title ? (
              storyData.metadata.title
            ) : (
              <Localized id="storyInfoDrawer-titleNotAvailable">
                Title not available
              </Localized>
            )}
          </h2>
          <TextLink className={styles.storyLink} href={storyData.url}>
            {storyData.url}
          </TextLink>
          {storyData.isArchived || storyData.isArchiving ? (
            <Flex direction="column" className={styles.status}>
              <Flex direction="column" className={styles.archived}>
                <ArchivedMarker />
                {viewerData && (
                  <ArchiveStoryActionsContainer
                    story={storyData}
                    viewer={viewerData}
                  />
                )}
              </Flex>
            </Flex>
          ) : (
            <>
              <Flex
                direction="row"
                alignItems="center"
                className={styles.status}
              >
                <StoryStatus
                  storyID={storyData.id}
                  currentStatus={storyData.status as GQLSTORY_STATUS}
                />
                {viewerData && (
                  <ModerateStoryButton
                    story={storyData}
                    settings={settingsData}
                    viewer={viewerData}
                  />
                )}
              </Flex>
              <RescrapeStory storyID={storyData.id} />
              {viewerData && (
                <ArchiveStoryActionsContainer
                  story={storyData}
                  viewer={viewerData}
                />
              )}
              <StorySettingsContainer
                settings={storyData.settings}
                storyID={storyData.id}
              />
            </>
          )}
        </Flex>
      </Flex>
    </HorizontalGutter>
  );
};

export default StoryInfoDrawerContainer;
