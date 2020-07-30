import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

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
    <div className={styles.root}>
      <DiscussionsHeader
        header={
          <Localized id="discussions-myOngoingDiscussions">
            My ongoing discussions
          </Localized>
        }
        subHeader={
          <Localized
            id="discussions-myOngoingDiscussions-subhead"
            $orgName={settings.organization.name}
          >
            <>
              Ranked by the most comments received over the last 24 hours on{" "}
              {settings.organization.name}
            </>
          </Localized>
        }
        icon="history"
      />
      <ul className={styles.list}>
        {viewer.ongoingDiscussions.map((story) => (
          <li key={story.id}>
            <StoryRowContainer story={story} currentSiteID={currentSiteID} />
          </li>
        ))}
      </ul>
    </div>
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
