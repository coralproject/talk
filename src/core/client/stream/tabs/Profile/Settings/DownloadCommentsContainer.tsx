import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { reduceSeconds, UNIT } from "coral-framework/lib/i18n";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { DownloadCommentsContainer_viewer } from "coral-stream/__generated__/DownloadCommentsContainer_viewer.graphql";
import { Button, CallOut, Icon, Typography } from "coral-ui/components";

import RequestCommentsDownloadMutation from "./RequestCommentsDownloadMutation";

import styles from "./DownloadCommentsContainer.css";

/**
 * DOWNLOAD_LIMIT_TIMEFRAME is the number of seconds that a given download may
 * be made within.
 */
const DOWNLOAD_LIMIT_TIMEFRAME = 14 * UNIT.DAYS;

interface Props {
  viewer: DownloadCommentsContainer_viewer;
}

const DownloadCommentsContainer: FunctionComponent<Props> = ({ viewer }) => {
  const requestComments = useMutation(RequestCommentsDownloadMutation);
  const onClick = useCallback(() => {
    requestComments();
  }, [requestComments]);

  const { locales } = useCoralContext();
  const lastDownload = viewer.lastDownload
    ? new Date(viewer.lastDownload)
    : null;
  const sinceLastDownload = lastDownload
    ? Math.ceil((Date.now() - lastDownload.getTime()) / 1000)
    : 0;
  const canDownload =
    !lastDownload || sinceLastDownload >= DOWNLOAD_LIMIT_TIMEFRAME;
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
      {lastDownload && (
        <Localized
          id="profile-settings-download-comments-recentRequest"
          $timeStamp={formatter.format(lastDownload)}
        >
          <Typography variant="bodyCopy" className={styles.recentRequest}>
            Your most recent request: {formatter.format(lastDownload)}
          </Typography>
        </Localized>
      )}
      {canDownload ? (
        <Button variant="outlined" size="small" onClick={onClick}>
          <Localized
            id="profile-settings-download-comments-request-icon"
            attrs={{ title: true }}
          >
            <Icon size="sm" className={styles.icon}>
              file_download
            </Icon>
          </Localized>
          <Localized id="profile-settings-download-comments-request">
            <span>Request comment history</span>
          </Localized>
        </Button>
      ) : (
        <CallOut fullWidth className={styles.callout}>
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
      lastDownload
    }
  `,
})(DownloadCommentsContainer);

export default enhanced;
