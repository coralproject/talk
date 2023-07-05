import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { HorizontalGutter } from "coral-ui/components/v2";

import { MyOngoingDiscussionsContainer_settings } from "coral-stream/__generated__/MyOngoingDiscussionsContainer_settings.graphql";
import { MyOngoingDiscussionsContainer_viewer } from "coral-stream/__generated__/MyOngoingDiscussionsContainer_viewer.graphql";

import DiscussionsHeader from "./DiscussionsHeader";
import StoryRowContainer from "./StoryRowContainer";

import styles from "./MyOngoingDiscussionsContainer.css";

interface Props {
  viewer: MyOngoingDiscussionsContainer_viewer;
  settings: MyOngoingDiscussionsContainer_settings;
  currentSiteID: string;
}

const MyOngoingDiscussionsContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
  currentSiteID,
}) => {
  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.discussions.myOngoingDiscussions)}
      spacing={4}
      container="section"
      aria-labelledby="discussions-myOngoingDiscussions-title"
    >
      <DiscussionsHeader
        header={
          <Localized id="discussions-myOngoingDiscussions">
            <span id="discussions-myOngoingDiscussions-title">
              My ongoing discussions
            </span>
          </Localized>
        }
        subHeader={
          <Localized
            id="discussions-myOngoingDiscussions-subhead"
            vars={{ orgName: settings.organization.name }}
          >
            <>Where you’ve commented across {settings.organization.name}</>
          </Localized>
        }
        icon="history"
      />
      {viewer.ongoingDiscussions.length === 0 && (
        <Localized id="discussions-mostActiveDiscussions-empty">
          <p className={styles.emptyList}>
            You haven’t participated in any discussions
          </p>
        </Localized>
      )}
      <ul className={cn(styles.list, CLASSES.discussions.discussionsList)}>
        {viewer.ongoingDiscussions.map((story) => (
          <li key={cn(story.id, CLASSES.discussions.story.$root)}>
            <StoryRowContainer story={story} currentSiteID={currentSiteID} />
          </li>
        ))}
      </ul>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment MyOngoingDiscussionsContainer_viewer on User {
      ongoingDiscussions {
        id
        ...StoryRowContainer_story
      }
    }
  `,
  settings: graphql`
    fragment MyOngoingDiscussionsContainer_settings on Settings {
      organization {
        name
      }
    }
  `,
})(MyOngoingDiscussionsContainer);

export default enhanced;
