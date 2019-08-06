import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { DownloadCommentsContainer_viewer } from "coral-stream/__generated__/DownloadCommentsContainer_viewer.graphql";
import { Button, CallOut, Flex, Icon, Typography } from "coral-ui/components";
import { Localized } from "fluent-react/compat";

import RequestCommentsDownloadMutation from "./RequestCommentsDownloadMutation";

import styles from "./DownloadCommentsContainer.css";

interface Props {
  viewer: DownloadCommentsContainer_viewer;
}

function computeDaysSinceLastDownload(lastDownload: Date) {
  const nowSeconds = Date.now() / 1000;
  const lastDownloadSeconds = lastDownload.getTime() / 1000;

  const diffSeconds = nowSeconds - lastDownloadSeconds;
  const diffDays = diffSeconds / 86400;

  return diffDays;
}

const DownloadCommentsContainer: FunctionComponent<Props> = ({ viewer }) => {
  const hasLastDownload =
    viewer.lastDownload !== null && viewer.lastDownload !== undefined;
  const dayLimit = 14;
  const daysSinceLastDownload = hasLastDownload
    ? computeDaysSinceLastDownload(new Date(viewer.lastDownload))
    : dayLimit;
  const canDownload = hasLastDownload ? daysSinceLastDownload > dayLimit : true;
  const daysTilCanDownload = Math.ceil(dayLimit - daysSinceLastDownload);

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
      {hasLastDownload && (
        <Localized
          id="profile-settings-download-comments-recentRequest"
          $timeStamp={Intl.DateTimeFormat("en-us").format(
            new Date(viewer.lastDownload)
          )}
        >
          <Typography variant="bodyCopy" className={styles.recentRequest}>
            Your most recent request:
            {Intl.DateTimeFormat("en-us").format(new Date(viewer.lastDownload))}
          </Typography>
        </Localized>
      )}
      {canDownload && (
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
      )}
      {!canDownload && (
        <CallOut fullWidth className={styles.callout}>
          <Icon size="lg" className={styles.icon}>
            query_builder
          </Icon>
          <Localized
            id="profile-settings-download-comments-timeOut"
            $days={daysTilCanDownload}
          >
            {`You can submit another request in ${daysTilCanDownload} days`}
          </Localized>
        </CallOut>
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment DownloadCommentsContainer_viewer on User {
      id
      lastDownload
    }
  `,
})(DownloadCommentsContainer);

export default enhanced;
