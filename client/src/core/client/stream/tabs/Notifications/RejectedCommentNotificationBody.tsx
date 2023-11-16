import { FluentBundle } from "@fluent/bundle/compat";
import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  GQLDSAReportDecisionLegality,
  GQLNOTIFICATION_TYPE,
  GQLREJECTION_REASON_CODE,
} from "coral-framework/schema";

import {
  DSAReportDecisionLegality,
  RejectedCommentNotificationBody_notification,
  REJECTION_REASON_CODE,
} from "coral-stream/__generated__/RejectedCommentNotificationBody_notification.graphql";

import NotificationCommentContainer from "./NotificationCommentContainer";

import styles from "./RejectedCommentNotificationBody.css";

interface Props {
  notification: RejectedCommentNotificationBody_notification;
}

const getLegalReason = (
  bundles: FluentBundle[],
  legality: DSAReportDecisionLegality | null
) => {
  if (legality === GQLDSAReportDecisionLegality.LEGAL) {
    return getMessage(
      bundles,
      "notifications-dsaReportLegality-legal",
      "Legal content"
    );
  }
  if (legality === GQLDSAReportDecisionLegality.ILLEGAL) {
    return getMessage(
      bundles,
      "notifications-dsaReportLegality-illegal",
      "Illegal content"
    );
  }

  return getMessage(
    bundles,
    "notifications-dsaReportLegality-unknown",
    "Unknown"
  );
};

const getGeneralReason = (
  bundles: FluentBundle[],
  reason: REJECTION_REASON_CODE | null
) => {
  if (reason === GQLREJECTION_REASON_CODE.OFFENSIVE) {
    return getMessage(
      bundles,
      "notifications-rejectionReason-offensive",
      "Offensive"
    );
  }
  if (reason === GQLREJECTION_REASON_CODE.ABUSIVE) {
    return getMessage(
      bundles,
      "notifications-rejectionReason-abusive",
      "Abusive"
    );
  }
  if (reason === GQLREJECTION_REASON_CODE.SPAM) {
    return getMessage(bundles, "notifications-rejectionReason-spam", "Spam");
  }
  if (reason === GQLREJECTION_REASON_CODE.BANNED_WORD) {
    return getMessage(
      bundles,
      "notifications-rejectionReason-bannedWord",
      "Banned word"
    );
  }
  if (reason === GQLREJECTION_REASON_CODE.AD) {
    return getMessage(bundles, "notifications-rejectionReason-ad", "Ad");
  }
  if (reason === GQLREJECTION_REASON_CODE.ILLEGAL_CONTENT) {
    return getMessage(
      bundles,
      "notifications-rejectionReason-illegalContent",
      "Illegal content"
    );
  }
  if (reason === GQLREJECTION_REASON_CODE.OTHER) {
    return getMessage(bundles, "notifications-rejectionReason-other", "Other");
  }

  return getMessage(
    bundles,
    "notifications-rejectionReason-unknown",
    "Unknown"
  );
};

const stringIsNullOrEmpty = (value: string) => {
  return value === undefined || value === null || value === "";
};

const RejectedCommentNotificationBody: FunctionComponent<Props> = ({
  notification,
}) => {
  const { type, decisionDetails, rejectionReason, comment } = notification;

  const { localeBundles } = useCoralContext();

  const hasExplanation = !stringIsNullOrEmpty(
    (decisionDetails?.explanation ?? "").trim()
  );
  const hasLegalGrounds = !stringIsNullOrEmpty(
    (decisionDetails?.grounds ?? "").trim()
  );

  return (
    <div className={styles.body}>
      <Localized id="notifications-rejectedComment-body">
        <p>
          The content of your comment was against our community guidelines. The
          comment has been removed.
        </p>
      </Localized>
      {type === GQLNOTIFICATION_TYPE.COMMENT_REJECTED &&
        rejectionReason &&
        decisionDetails && (
          <div className={styles.details}>
            <Localized id="notifications-reasonForRemoval">
              <div className={styles.detailLabel}>Reason for removal</div>
            </Localized>
            <div className={styles.detailItem}>
              {getGeneralReason(localeBundles, rejectionReason)}
            </div>
            {hasExplanation && (
              <>
                <Localized id="notifications-additionalExplanation">
                  <div className={styles.detailLabel}>
                    Additional explanation
                  </div>
                </Localized>
                <div className={styles.detailItem}>
                  {decisionDetails.explanation || ""}
                </div>
              </>
            )}
          </div>
        )}
      {type === GQLNOTIFICATION_TYPE.ILLEGAL_REJECTED && decisionDetails && (
        <div className={styles.details}>
          <Localized id="notifications-reasonForRemoval">
            <div className={styles.detailLabel}>Reason for removal</div>
          </Localized>
          <div className={styles.detailItem}>
            {getLegalReason(localeBundles, decisionDetails.legality)}
          </div>
          {hasLegalGrounds && (
            <>
              <Localized id="notifications-legalGrounds">
                <div className={styles.detailLabel}>Legal grounds</div>
              </Localized>
              <div className={styles.detailItem}>
                {decisionDetails.grounds || ""}
              </div>
            </>
          )}
          {hasExplanation && (
            <>
              <Localized id="notifications-additionalExplanation">
                <div className={styles.detailLabel}>Additional explanation</div>
              </Localized>
              <div className={styles.detailItem}>
                {decisionDetails.explanation || ""}
              </div>
            </>
          )}
        </div>
      )}
      {comment && (
        <div>
          <NotificationCommentContainer
            comment={comment}
            openedStateText={
              <Localized id="notifications-comment-hideRemovedComment">
                - Hide removed comment
              </Localized>
            }
            closedStateText={
              <Localized id="notifications-comment-showRemovedComment">
                + Show removed comment
              </Localized>
            }
          />
        </div>
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment RejectedCommentNotificationBody_notification on Notification {
      type
      rejectionReason
      decisionDetails {
        legality
        grounds
        explanation
      }
      comment {
        ...NotificationCommentContainer_comment
      }
    }
  `,
})(RejectedCommentNotificationBody);

export default enhanced;
