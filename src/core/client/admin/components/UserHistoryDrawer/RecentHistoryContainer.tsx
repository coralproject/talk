import React, { FunctionComponent, useMemo } from "react";
import { graphql, useFragment } from "react-relay";

import { GQLCOMMENT_STATUS } from "coral-framework/schema";

import { RecentHistoryContainer_settings$key as RecentHistoryContainer_settings } from "coral-admin/__generated__/RecentHistoryContainer_settings.graphql";
import { RecentHistoryContainer_user$key as RecentHistoryContainer_user } from "coral-admin/__generated__/RecentHistoryContainer_user.graphql";

import RecentHistory from "./RecentHistory";

const PUBLISHED_STATUSES = [GQLCOMMENT_STATUS.NONE, GQLCOMMENT_STATUS.APPROVED];

interface Props {
  user: RecentHistoryContainer_user;
  settings: RecentHistoryContainer_settings;
}

const RecentHistoryContainer: FunctionComponent<Props> = ({
  user,
  settings,
}) => {
  const userData = useFragment(
    graphql`
      fragment RecentHistoryContainer_user on User {
        recentCommentHistory {
          statuses {
            NONE
            APPROVED
            REJECTED
            PREMOD
            SYSTEM_WITHHELD
          }
        }
      }
    `,
    user
  );
  const settingsData = useFragment(
    graphql`
      fragment RecentHistoryContainer_settings on Settings {
        recentCommentHistory {
          enabled
          timeFrame
          triggerRejectionRate
        }
      }
    `,
    settings
  );

  const submitted = useMemo(
    () =>
      Object.keys(userData.recentCommentHistory.statuses).reduce(
        (acc, key: keyof typeof userData.recentCommentHistory.statuses) =>
          userData.recentCommentHistory.statuses[key] + acc,
        0
      ),
    [userData]
  );
  const rejectionRate = useMemo(() => {
    const published = PUBLISHED_STATUSES.reduce(
      (acc, status) => userData.recentCommentHistory.statuses[status] + acc,
      0
    );
    const rejected =
      userData.recentCommentHistory.statuses[GQLCOMMENT_STATUS.REJECTED];
    const total = published + rejected;
    if (total === 0) {
      return 0;
    }

    return rejected / total;
  }, [userData]);
  const triggered =
    settingsData.recentCommentHistory.enabled &&
    rejectionRate >= settingsData.recentCommentHistory.triggerRejectionRate;

  return (
    <RecentHistory
      triggered={triggered}
      timeFrame={settingsData.recentCommentHistory.timeFrame}
      rejectionRate={rejectionRate}
      submitted={submitted}
    />
  );
};

export default RecentHistoryContainer;
