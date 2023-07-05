import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS } from "coral-framework/schema";

import { RecentHistoryContainer_settings } from "coral-admin/__generated__/RecentHistoryContainer_settings.graphql";
import { RecentHistoryContainer_user } from "coral-admin/__generated__/RecentHistoryContainer_user.graphql";

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
  const submitted = useMemo(
    () =>
      Object.keys(user.recentCommentHistory.statuses).reduce(
        (acc, key: keyof typeof user.recentCommentHistory.statuses) =>
          user.recentCommentHistory.statuses[key] + acc,
        0
      ),
    [user]
  );
  const rejectionRate = useMemo(() => {
    const published = PUBLISHED_STATUSES.reduce(
      (acc, status) => user.recentCommentHistory.statuses[status] + acc,
      0
    );
    const rejected =
      user.recentCommentHistory.statuses[GQLCOMMENT_STATUS.REJECTED];
    const total = published + rejected;
    if (total === 0) {
      return 0;
    }

    return rejected / total;
  }, [user]);
  const triggered =
    settings.recentCommentHistory.enabled &&
    rejectionRate >= settings.recentCommentHistory.triggerRejectionRate;

  return (
    <RecentHistory
      triggered={triggered}
      timeFrame={settings.recentCommentHistory.timeFrame}
      rejectionRate={rejectionRate}
      submitted={submitted}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
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
  settings: graphql`
    fragment RecentHistoryContainer_settings on Settings {
      recentCommentHistory {
        enabled
        timeFrame
        triggerRejectionRate
      }
    }
  `,
})(RecentHistoryContainer);

export default enhanced;
