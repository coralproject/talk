import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { DOWNLOAD_LIMIT_TIMEFRAME } from "coral-common/constants";
import { reduceSeconds, UNIT } from "coral-common/helpers/i18n";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { DownloadCommentsContainer_viewer } from "coral-stream/__generated__/DownloadCommentsContainer_viewer.graphql";
import CLASSES from "coral-stream/classes";
import { Button, CallOut, Flex, Icon, Typography } from "coral-ui/components";

import RequestCommentsDownloadMutation from "./RequestCommentsDownloadMutation";

import styles from "./DownloadCommentsContainer.css";

interface Props {
  viewer: DownloadCommentsContainer_viewer;
}

const DownloadCommentsContainer: FunctionComponent<Props> = ({ viewer }) => {
  const requestComments = useMutation(RequestCommentsDownloadMutation);
  const onClick = useCallback(() => {
    requestComments();
  }, [requestComments]);

  const { locales } = useCoralContext();
  const lastDownloadedAt = viewer.lastDownloadedAt
    ? new Date(viewer.lastDownloadedAt)
    : null;
  const sinceLastDownload = lastDownloadedAt
    ? Math.ceil((Date.now() - lastDownloadedAt.getTime()) / 1000)
    : 0;
  const canDownload =
    !lastDownloadedAt || sinceLastDownload >= DOWNLOAD_LIMIT_TIMEFRAME;
  const tilCanDownload = DOWNLOAD_LIMIT_TIMEFRAME - sinceLastDownload;
  const formatter = new Intl.DateTimeFormat(locales, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
  const { scaled, unit } = reduceSeconds(tilCanDownload, [
    UNIT.DAYS,
    UNIT.HOURS,
    UNIT.MINUTES,
  ]);

  return (
    <div className={cn(styles.root, CLASSES.downloadCommentHistory.$root)}>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <div>
          <Localized id="profile-settings-download-comments-title">
            <Typography
              variant="heading2"
              color="textDark"
              className={styles.title}
            >
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
          {lastDownloadedAt && (
            <Localized
              id="profile-settings-download-comments-recentRequest"
              $timeStamp={formatter.format(lastDownloadedAt)}
            >
              <Typography
                variant="bodyCopy"
                className={cn(
                  styles.recentRequest,
                  CLASSES.downloadCommentHistory.recentRequest
                )}
              >
                Your most recent request: {formatter.format(lastDownloadedAt)}
              </Typography>
            </Localized>
          )}
        </div>
        <div>
          {canDownload && (
            <Localized id="profile-settings-download-comments-request-button">
              <Button
                variant="outlineFilled"
                color="primary"
                size="small"
                className={CLASSES.downloadCommentHistory.requestButton}
                onClick={onClick}
              >
                Request
              </Button>
            </Localized>
          )}
        </div>
      </Flex>
      {!canDownload && (
        <CallOut
          fullWidth
          className={cn(
            styles.callout,
            CLASSES.downloadCommentHistory.requestLater
          )}
        >
          <Icon size="lg" className={styles.icon}>
            query_builder
          </Icon>
          <Localized
            id="profile-settings-download-comments-timeOut"
            $value={scaled}
            $unit={unit}
          >
            <span>
              You can submit another request in {scaled} {unit}
            </span>
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
      lastDownloadedAt
    }
  `,
})(DownloadCommentsContainer);

export default enhanced;
