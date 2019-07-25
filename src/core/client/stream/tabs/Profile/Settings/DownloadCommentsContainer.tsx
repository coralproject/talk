import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { DownloadCommentsContainer_viewer } from "coral-stream/__generated__/DownloadCommentsContainer_viewer.graphql";
import { Button, Flex, Icon, Typography } from "coral-ui/components";
import { Localized } from "fluent-react/compat";

import styles from "./DownloadCommentsContainer.css";
import RequestCommentsDownloadMutation from "./RequestCommentsDownloadMutation";

interface Props {
  viewer: DownloadCommentsContainer_viewer;
}

const DownloadCommentsContainer: FunctionComponent<Props> = ({ viewer }) => {
  const requestComments = useMutation(RequestCommentsDownloadMutation);
  return (
    <div className={styles.root}>
      <Localized id="profile-settings-download-comments-title">
        <Typography variant="heading3" className={styles.title}>
          Download my comment history
        </Typography>
      </Localized>
      <Localized
        id="profile-settings-download-comments-description"
        strong={<strong />}
      >
        <Typography variant="bodyCopy" className={styles.description}>
          You will receive an email with a link to download your comment
          history. You can make one download request every 14 days.
        </Typography>
      </Localized>
      <Button
        className={styles.requestButton}
        onClick={() => requestComments()}
      >
        <Flex alignItems="center">
          <Localized
            id="profile-settings-download-comments-request-icon"
            attrs={{ title: true }}
          >
            <Icon size="sm" className={styles.icon}>
              file_download
            </Icon>
          </Localized>
          <Localized
            id="profile-settings-download-comments-request"
            class={styles.requestButtonText}
          >
            Request comment history
          </Localized>
        </Flex>
      </Button>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment DownloadCommentsContainer_viewer on User {
      id
    }
  `,
})(DownloadCommentsContainer);

export default enhanced;
