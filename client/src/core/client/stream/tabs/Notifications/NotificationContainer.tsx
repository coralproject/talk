import { FluentBundle } from "@fluent/bundle/compat";
import cn from "classnames";
import React, { ComponentType, FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLNOTIFICATION_TYPE } from "coral-framework/schema";
import {
  CheckCircleIcon,
  LegalHammerIcon,
  QuestionCircleIcon,
  RejectCommentBoxIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import { Timestamp } from "coral-ui/components/v2";

import {
  NOTIFICATION_TYPE,
  NotificationContainer_notification,
} from "coral-stream/__generated__/NotificationContainer_notification.graphql";
import { NotificationContainer_viewer } from "coral-stream/__generated__/NotificationContainer_viewer.graphql";

import DSAReportDecisionMadeNotificationBody from "./DSAReportDecisionMadeNotificationBody";
import RejectedCommentNotificationBody from "./RejectedCommentNotificationBody";

import styles from "./NotificationContainer.css";

interface Props {
  viewer: NotificationContainer_viewer | null;
  notification: NotificationContainer_notification;
}

const getIcon = (type: NOTIFICATION_TYPE | null): ComponentType => {
  if (type === GQLNOTIFICATION_TYPE.COMMENT_APPROVED) {
    return CheckCircleIcon;
  }
  if (type === GQLNOTIFICATION_TYPE.COMMENT_FEATURED) {
    return CheckCircleIcon;
  }
  if (type === GQLNOTIFICATION_TYPE.COMMENT_REJECTED) {
    return RejectCommentBoxIcon;
  }
  if (type === GQLNOTIFICATION_TYPE.ILLEGAL_REJECTED) {
    return RejectCommentBoxIcon;
  }
  if (type === GQLNOTIFICATION_TYPE.DSA_REPORT_DECISION_MADE) {
    return LegalHammerIcon;
  }

  return QuestionCircleIcon;
};

const getTitle = (bundles: FluentBundle[], type: NOTIFICATION_TYPE | null) => {
  if (type === GQLNOTIFICATION_TYPE.COMMENT_APPROVED) {
    return getMessage(
      bundles,
      "notifications-yourCommentHasBeenApproved",
      "Your comment has been approved"
    );
  }
  if (type === GQLNOTIFICATION_TYPE.COMMENT_FEATURED) {
    return getMessage(
      bundles,
      "notifications-yourCommentHasBeenFeatured",
      "Your comment has been featured"
    );
  }
  if (type === GQLNOTIFICATION_TYPE.COMMENT_REJECTED) {
    return getMessage(
      bundles,
      "notifications-yourCommentHasBeenRejected",
      "Your comment has been rejected"
    );
  }
  if (type === GQLNOTIFICATION_TYPE.ILLEGAL_REJECTED) {
    return getMessage(
      bundles,
      "notifications-yourCommentHasBeenRejected",
      "Your comment has been rejected"
    );
  }
  if (type === GQLNOTIFICATION_TYPE.DSA_REPORT_DECISION_MADE) {
    return getMessage(
      bundles,
      "notifications-yourIllegalContentReportHasBeenReviewed",
      "Your illegal content report has been reviewed"
    );
  }

  return getMessage(bundles, "notifications-defaultTitle", "Notification");
};

const NotificationContainer: FunctionComponent<Props> = ({
  notification,
  viewer,
}) => {
  const { type, createdAt } = notification;
  const { localeBundles } = useCoralContext();

  const seen = useMemo(() => {
    if (!viewer) {
      return false;
    }

    const createdAtDate = new Date(createdAt);
    const lastSeenDate = viewer.lastSeenNotificationDate
      ? new Date(viewer.lastSeenNotificationDate)
      : new Date(0);

    return createdAtDate.getTime() <= lastSeenDate.getTime();
  }, [createdAt, viewer]);

  return (
    <>
      <div
        className={cn(styles.root, {
          [styles.seen]: seen,
          [styles.notSeen]: !seen,
        })}
      >
        <div className={styles.title}>
          <SvgIcon size="sm" Icon={getIcon(type)} />
          <div className={styles.titleText}>
            {getTitle(localeBundles, type)}
          </div>
        </div>
        {(type === GQLNOTIFICATION_TYPE.COMMENT_REJECTED ||
          type === GQLNOTIFICATION_TYPE.ILLEGAL_REJECTED) && (
          <RejectedCommentNotificationBody notification={notification} />
        )}
        {type === GQLNOTIFICATION_TYPE.DSA_REPORT_DECISION_MADE && (
          <DSAReportDecisionMadeNotificationBody notification={notification} />
        )}
        <div className={styles.footer}>
          <Timestamp className={styles.timestamp}>{createdAt}</Timestamp>
        </div>
      </div>
      <div className={styles.divider}></div>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment NotificationContainer_viewer on User {
      lastSeenNotificationDate
    }
  `,
  notification: graphql`
    fragment NotificationContainer_notification on Notification {
      id
      createdAt
      type
      commentStatus
      comment {
        ...NotificationCommentContainer_comment
      }
      ...RejectedCommentNotificationBody_notification
      ...DSAReportDecisionMadeNotificationBody_notification
    }
  `,
})(NotificationContainer);

export default enhanced;
