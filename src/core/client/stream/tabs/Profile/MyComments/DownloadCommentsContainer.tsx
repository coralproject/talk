import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { DOWNLOAD_LIMIT_TIMEFRAME_DURATION } from "coral-common/constants";
import { reduceSeconds } from "coral-common/helpers/i18n";
import TIME from "coral-common/time";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Button, Flex, Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { DownloadCommentsContainer_viewer } from "coral-stream/__generated__/DownloadCommentsContainer_viewer.graphql";

import RequestCommentsDownloadMutation from "../Settings/RequestCommentsDownloadMutation";

import styles from "./DownloadCommentsContainer.css";

interface Props {
  viewer: DownloadCommentsContainer_viewer;
}

const DownloadCommentsContainer: FunctionComponent<Props> = ({ viewer }) => {
  const requestComments = useMutation(RequestCommentsDownloadMutation);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const onClick = useCallback(async () => {
    try {
      await requestComments();
      setShowSuccessMessage(true);
    } catch (err) {
      setShowErrorMessage(true);
    }
  }, [requestComments, setShowSuccessMessage, setShowErrorMessage]);

  const { locales } = useCoralContext();
  const lastDownloadedAt = viewer.lastDownloadedAt
    ? new Date(viewer.lastDownloadedAt)
    : null;
  const sinceLastDownload = lastDownloadedAt
    ? Math.ceil((Date.now() - lastDownloadedAt.getTime()) / 1000)
    : 0;
  const canDownload =
    !lastDownloadedAt || sinceLastDownload >= DOWNLOAD_LIMIT_TIMEFRAME_DURATION;
  const tilCanDownload = DOWNLOAD_LIMIT_TIMEFRAME_DURATION - sinceLastDownload;
  const formatter = new Intl.DateTimeFormat(locales, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  const { scaled, unit } = reduceSeconds(tilCanDownload, [
    TIME.DAY,
    TIME.HOUR,
    TIME.MINUTE,
  ]);

  const onCloseSuccess = useCallback(() => {
    setShowSuccessMessage(false);
  }, [setShowSuccessMessage]);
  const onCloseError = useCallback(() => {
    setShowErrorMessage(false);
  }, [setShowErrorMessage]);

  return (
    <div className={cn(styles.root, CLASSES.downloadCommentHistory.$root)}>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <div className={styles.content}>
          <Localized id="profile-account-download-comments-title">
            <div className={styles.title}>Download my comment history</div>
          </Localized>
          <Localized
            id="profile-account-download-comments-description"
            strong={<strong />}
          >
            <div className={styles.description}>
              You will receive an email with a link to download your comment
              history. You can make one download request every 14 days.
            </div>
          </Localized>
          <div className={styles.requestContainer}>
            <Localized id="profile-account-download-comments-request-button">
              <Button
                variant="regular"
                color="regular"
                size="regular"
                disabled={!canDownload}
                className={CLASSES.downloadCommentHistory.requestButton}
                onClick={onClick}
              >
                Request
              </Button>
            </Localized>
          </div>
          {lastDownloadedAt && !showSuccessMessage && (
            <Localized
              id="profile-account-download-comments-yourMostRecentRequest"
              $timeStamp={formatter.format(lastDownloadedAt)}
            >
              <div
                className={cn(
                  styles.recentRequest,
                  CLASSES.downloadCommentHistory.recentRequest
                )}
              >
                Your most recent request was within the last 14 days. You may
                request to download your comments again on:{" "}
                {formatter.format(lastDownloadedAt)}.
              </div>
            </Localized>
          )}
        </div>
      </Flex>
      {showSuccessMessage && (
        <CallOut
          color="success"
          className={cn(
            styles.callout,
            CLASSES.downloadCommentHistory.requestLater
          )}
          visible={showSuccessMessage}
          onClose={onCloseSuccess}
        >
          <Flex justifyContent="flex-start" alignItems="center">
            <Icon size="sm" className={styles.successIcon}>
              check_circle
            </Icon>
            <Localized
              id="profile-account-download-comments-requestSubmitted"
              $value={scaled}
              $unit={unit}
            >
              <span>
                Your request has been successfully submitted. You may request to
                download your comment history again in {scaled} {unit}.
              </span>
            </Localized>
          </Flex>
        </CallOut>
      )}
      {showErrorMessage && (
        <CallOut
          color="alert"
          className={cn(
            styles.callout,
            CLASSES.downloadCommentHistory.requestError
          )}
          visible={showErrorMessage}
          onClose={onCloseError}
        >
          <Flex justifyContent="flex-start" alignItems="center">
            <Icon size="sm" className={styles.errorIcon}>
              warning
            </Icon>
            <Localized
              id="profile-account-download-comments-error"
              $value={scaled}
              $unit={unit}
            >
              <span>We were unable to complete your download request.</span>
            </Localized>
          </Flex>
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
