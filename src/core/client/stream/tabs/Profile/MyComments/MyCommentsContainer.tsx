import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { HorizontalRule } from "coral-ui/components/v2";

import { MyCommentsContainer_settings$key as MyCommentsContainer_settings } from "coral-stream/__generated__/MyCommentsContainer_settings.graphql";
import { MyCommentsContainer_story$key as MyCommentsContainer_story } from "coral-stream/__generated__/MyCommentsContainer_story.graphql";
import { MyCommentsContainer_viewer$key as MyCommentsContainer_viewer } from "coral-stream/__generated__/MyCommentsContainer_viewer.graphql";

import CommentHistoryContainer from "./CommentHistoryContainer";
import DownloadCommentsContainer from "./DownloadCommentsContainer";

import styles from "./MyCommentsContainer.css";

interface Props {
  settings: MyCommentsContainer_settings;
  viewer: MyCommentsContainer_viewer;
  story: MyCommentsContainer_story;
}

const MyCommentsContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
  story,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment MyCommentsContainer_viewer on User {
        ...CommentHistoryContainer_viewer
        ...DownloadCommentsContainer_viewer
      }
    `,
    viewer
  );
  const storyData = useFragment(
    graphql`
      fragment MyCommentsContainer_story on Story {
        ...CommentHistoryContainer_story
      }
    `,
    story
  );
  const settingsData = useFragment(
    graphql`
      fragment MyCommentsContainer_settings on Settings {
        accountFeatures {
          downloadComments
        }
        ...CommentHistoryContainer_settings
      }
    `,
    settings
  );

  return (
    <>
      {settingsData.accountFeatures.downloadComments && (
        <div className={styles.downloadComments}>
          <DownloadCommentsContainer viewer={viewerData} />
          <HorizontalRule />
        </div>
      )}
      <CommentHistoryContainer
        settings={settingsData}
        viewer={viewerData}
        story={storyData}
      />
    </>
  );
};

export default MyCommentsContainer;
