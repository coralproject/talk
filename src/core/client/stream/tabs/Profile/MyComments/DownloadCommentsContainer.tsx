import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { DOWNLOAD_LIMIT_TIMEFRAME_DURATION } from "coral-common/constants";
import { reduceSeconds } from "coral-common/helpers/i18n";
import TIME from "coral-common/time";
import { useDateTimeFormatter } from "coral-framework/hooks";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

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
  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const lastDownloadedAt = viewer.lastDownloadedAt
    ? new Date(viewer.lastDownloadedAt)
    : null;
  const sinceLastDownload = lastDownloadedAt
    ? Math.ceil((Date.now() - lastDownloadedAt.getTime()) / 1000)
    : 0;
  const canDownload =
    !lastDownloadedAt || sinceLastDownload >= DOWNLOAD_LIMIT_TIMEFRAME_DURATION;
  const tilCanDownload = DOWNLOAD_LIMIT_TIMEFRAME_DURATION - sinceLastDownload;
  const canNextDownload = new Date(Date.now() + tilCanDownload * 1000);

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
    <section
      className={cn(styles.root, CLASSES.downloadCommentHistory.$root)}
      aria-labelledby="profile-account-download-comments-title"
    >
      <Flex justifyContent="space-between" alignItems="flex-start">
        <div>
          <Localized id="profile-account-download-comments-title">
            <h1
              className={styles.title}
              id="profile-account-download-comments-title"
            >
              Download my comment history
            </h1>
          </Localized>
          <Localized
            id="profile-account-download-comments-description"
            elems={{ strong: <strong /> }}
          >
            <div className={styles.description}>
              You will receive an email with a link to download your comment
              history. You can make one download request every 14 days.
            </div>
          </Localized>
          <div className={styles.requestContainer}>
            <Localized id="profile-account-download-comments-request-button">
              <Button
                disabled={!canDownload}
                className={CLASSES.downloadCommentHistory.requestButton}
                onClick={onClick}
                upperCase
              >
                Request
              </Button>
            </Localized>
          </div>
          {lastDownloadedAt && !showSuccessMessage && (
            <Localized
              id="profile-account-download-comments-yourMostRecentRequest"
              vars={{ timeStamp: formatter(canNextDownload) }}
            >
              <div
                className={cn(
                  styles.recentRequest,
                  CLASSES.downloadCommentHistory.recentRequest
                )}
              >
                Your most recent request was within the last 14 days. You may
                request to download your comments again on:{" "}
                {formatter(canNextDownload)}.
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
          icon={<Icon size="sm">check_circle</Icon>}
          titleWeight="semiBold"
          title={
            <Localized
              id="profile-account-download-comments-requestSubmitted"
              vars={{ value: scaled, unit }}
            >
              <span>
                Your request has been successfully submitted. You may request to
                download your comment history again in {scaled} {unit}.
              </span>
            </Localized>
          }
          aria-live="polite"
        />
      )}
      {showErrorMessage && (
        <CallOut
          color="error"
          className={cn(
            styles.callout,
            CLASSES.downloadCommentHistory.requestError
          )}
          visible={showErrorMessage}
          onClose={onCloseError}
          icon={<Icon size="sm">warning</Icon>}
          titleWeight="semiBold"
          title={
            <Localized
              id="profile-account-download-comments-error"
              vars={{ value: scaled, unit }}
            >
              <span>We were unable to complete your download request.</span>
            </Localized>
          }
          role="alert"
        />
      )}
    </section>
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
