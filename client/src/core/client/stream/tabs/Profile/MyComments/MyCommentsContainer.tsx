import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalRule } from "coral-ui/components/v2";

import { MyCommentsContainer_settings } from "coral-stream/__generated__/MyCommentsContainer_settings.graphql";
import { MyCommentsContainer_story } from "coral-stream/__generated__/MyCommentsContainer_story.graphql";
import { MyCommentsContainer_viewer } from "coral-stream/__generated__/MyCommentsContainer_viewer.graphql";

import CommentHistoryContainer from "./CommentHistoryContainer";
import DownloadCommentsContainer from "./DownloadCommentsContainer";

import styles from "./MyCommentsContainer.css";

// import styles from "./MyComments.css";

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
  return (
    <>
      {settings.accountFeatures.downloadComments && (
        <div className={styles.downloadComments}>
          <DownloadCommentsContainer viewer={viewer} />
          <HorizontalRule />
        </div>
      )}
      <CommentHistoryContainer
        settings={settings}
        viewer={viewer}
        story={story}
      />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment MyCommentsContainer_viewer on User {
      ...CommentHistoryContainer_viewer
      ...DownloadCommentsContainer_viewer
    }
  `,
  story: graphql`
    fragment MyCommentsContainer_story on Story {
      ...CommentHistoryContainer_story
    }
  `,
  settings: graphql`
    fragment MyCommentsContainer_settings on Settings {
      accountFeatures {
        downloadComments
      }
      ...CommentHistoryContainer_settings
    }
  `,
})(MyCommentsContainer);

export default enhanced;
