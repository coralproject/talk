import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLDSAReportDecisionLegality } from "coral-framework/schema";

import { DSAReportDecisionMadeNotificationBody_notification } from "coral-stream/__generated__/DSAReportDecisionMadeNotificationBody_notification.graphql";

import styles from "./DSAReportDecisionMadeNotificationBody.css";

interface Props {
  notification: DSAReportDecisionMadeNotificationBody_notification;
}

const DSAReportDecisionMadeNotificationBody: FunctionComponent<Props> = ({
  notification,
}) => {
  const { decisionDetails, dsaReport, comment } = notification;

  const date =
    dsaReport && dsaReport.createdAt
      ? new Date(dsaReport.createdAt).toDateString()
      : new Date(0).toDateString();
  const username = comment?.author?.username ?? "";

  return (
    <div className={styles.body}>
      {decisionDetails &&
        decisionDetails.legality === GQLDSAReportDecisionLegality.LEGAL && (
          <Localized
            id="notifications-reportDecisionMade-legal"
            vars={{
              date,
              author: username,
            }}
          >
            {`On ${date} you reported a comment written by ${username} for containing illegal content. After reviewing your report, our moderation team has decided this comment does not appear to contain illegal content.`}
          </Localized>
        )}
      {decisionDetails &&
        decisionDetails.legality === GQLDSAReportDecisionLegality.ILLEGAL && (
          <Localized
            id="notifications-reportDecisionMade-illegal"
            vars={{
              date,
              author: username,
            }}
          >
            {`On ${date} you reported a comment written by ${username} for containing illegal content. After reviewing your report, our moderation team has decided this comment does contain illegal content.`}
          </Localized>
        )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment DSAReportDecisionMadeNotificationBody_notification on Notification {
      type
      comment {
        author {
          username
        }
      }
      dsaReport {
        createdAt
      }
      decisionDetails {
        legality
      }
    }
  `,
})(DSAReportDecisionMadeNotificationBody);

export default enhanced;
