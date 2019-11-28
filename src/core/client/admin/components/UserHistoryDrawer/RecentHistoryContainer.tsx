import React, { FunctionComponent, useMemo } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS } from "coral-framework/schema";

import { RecentHistoryContainer_organization } from "coral-admin/__generated__/RecentHistoryContainer_organization.graphql";
import { RecentHistoryContainer_user } from "coral-admin/__generated__/RecentHistoryContainer_user.graphql";

import RecentHistory from "./RecentHistory";

const PUBLISHED_STATUSES = [GQLCOMMENT_STATUS.NONE, GQLCOMMENT_STATUS.APPROVED];

interface Props {
  user: RecentHistoryContainer_user;
  organization: RecentHistoryContainer_organization;
}

const RecentHistoryContainer: FunctionComponent<Props> = ({
  user,
  organization,
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
    organization.settings.recentCommentHistory.enabled &&
    rejectionRate >=
      organization.settings.recentCommentHistory.triggerRejectionRate;

  return (
    <RecentHistory
      triggered={triggered}
      timeFrame={organization.settings.recentCommentHistory.timeFrame}
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
  organization: graphql`
    fragment RecentHistoryContainer_organization on Organization {
      settings {
        recentCommentHistory {
          enabled
          timeFrame
          triggerRejectionRate
        }
      }
    }
  `,
})(RecentHistoryContainer);

export default enhanced;
