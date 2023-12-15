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
            elems={{ strong: <strong /> }}
          >
            <span>
              On <strong>{date}</strong> you reported a comment written by{" "}
              <strong>{username}</strong> for containing illegal content. After
              reviewing your report, our moderation team has decide this comment{" "}
              <strong>does not appear to contain illegal content.</strong> Thank
              you for helping to keep our community safe.
            </span>
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
            elems={{ strong: <strong /> }}
          >
            <span>
              On <strong>{date}</strong> you reported a comment written by{" "}
              <strong>{username}</strong> for containing illegal content. After
              reviewing your report, our moderation team has decided this
              comment <strong>does contain illegal content</strong> and has been
              removed. Further action may be taken against the commenter,
              however you will not be notified of any additional steps. Thank
              you for helping to keep our community safe.
            </span>
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
