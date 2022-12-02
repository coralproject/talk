import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "relay-runtime";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLSTORY_STATUS } from "coral-framework/schema";
import { Flex, HorizontalGutter, TextLink } from "coral-ui/components/v2";
import ArchivedMarker from "coral-ui/components/v3/ArchivedMarker/ArchivedMarker";

import { StoryInfoDrawerContainer_settings } from "coral-admin/__generated__/StoryInfoDrawerContainer_settings.graphql";
import { StoryInfoDrawerContainer_story } from "coral-admin/__generated__/StoryInfoDrawerContainer_story.graphql";
import { StoryInfoDrawerContainer_viewer } from "coral-admin/__generated__/StoryInfoDrawerContainer_viewer.graphql";

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
          {story.isArchived || story.isArchiving ? (
            <Flex direction="column" className={styles.status}>
              <div className={styles.flexSizeToContentWidth}>
                <ArchivedMarker />
              </div>
              {viewer && (
                <div className={styles.flexSizeToContentWidth}>
                  <ArchiveStoryActionsContainer story={story} viewer={viewer} />
                </div>
              )}
            </Flex>
          ) : (
            <>
              <Flex
                direction="row"
                alignItems="center"
                className={styles.status}
              >
                <StoryStatus
                  storyID={story.id}
                  currentStatus={story.status as GQLSTORY_STATUS}
                />
                {viewer && (
                  <ModerateStoryButton
                    story={story}
                    settings={settings}
                    viewer={viewer}
                  />
                )}
              </Flex>
              <RescrapeStory storyID={story.id} />
              {viewer && (
                <div className={styles.flexSizeToContentWidth}>
                  <ArchiveStoryActionsContainer story={story} viewer={viewer} />
                </div>
              )}
              <StorySettingsContainer
                settings={story.settings}
                storyID={story.id}
              />
            </>
          )}
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
      ...ModerateStoryButton_story
      settings {
        ...StorySettingsContainer_storySettings
      }
      ...ArchiveStoryActionsContainer_story
    }
  `,
  viewer: graphql`
    fragment StoryInfoDrawerContainer_viewer on User {
      ...ArchiveStoryActionsContainer_viewer
      ...ModerateStoryButton_viewer
    }
  `,
  settings: graphql`
    fragment StoryInfoDrawerContainer_settings on Settings {
      ...ModerateStoryButton_settings
    }
  `,
})(StoryInfoDrawerContainer);

export default enhanced;
