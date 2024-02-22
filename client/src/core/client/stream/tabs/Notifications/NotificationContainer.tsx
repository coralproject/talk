import { FluentBundle } from "@fluent/bundle/compat";
import cn from "classnames";
import React, { ComponentType, FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLNOTIFICATION_TYPE } from "coral-framework/schema";
import {
  CheckCircleIcon,
  LegalHammerIcon,
  MessagesBubbleSquareStarIcon,
  MessagesBubbleSquareTextIcon,
  QuestionCircleIcon,
  RejectCommentBoxIcon,
  SvgIcon,
} from "coral-ui/components/icons";

import {
  NOTIFICATION_TYPE,
  NotificationContainer_notification,
} from "coral-stream/__generated__/NotificationContainer_notification.graphql";
import { NotificationContainer_settings } from "coral-stream/__generated__/NotificationContainer_settings.graphql";
import { NotificationContainer_viewer } from "coral-stream/__generated__/NotificationContainer_viewer.graphql";

import AuthorBadgesContainer from "../Comments/Comment/AuthorBadgesContainer";
import ApprovedCommentNotificationBody from "./ApprovedCommentNotificationBody";
import DSAReportDecisionMadeNotificationBody from "./DSAReportDecisionMadeNotificationBody";
import FeaturedCommentNotificationBody from "./FeaturedCommentNotificationBody";
import RejectedCommentNotificationBody from "./RejectedCommentNotificationBody";
import RepliedCommentNotificationBody from "./RepliedCommentNotificationBody";

import styles from "./NotificationContainer.css";

interface Props {
  viewer: NotificationContainer_viewer | null;
  notification: NotificationContainer_notification;
  settings: NotificationContainer_settings;
}

const getIcon = (type: NOTIFICATION_TYPE | null): ComponentType => {
  if (type === GQLNOTIFICATION_TYPE.COMMENT_APPROVED) {
    return CheckCircleIcon;
  }
  if (type === GQLNOTIFICATION_TYPE.COMMENT_FEATURED) {
    return MessagesBubbleSquareStarIcon;
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
  if (type === GQLNOTIFICATION_TYPE.REPLY) {
    return MessagesBubbleSquareTextIcon;
  }
  if (type === GQLNOTIFICATION_TYPE.REPLY_STAFF) {
    return MessagesBubbleSquareTextIcon;
  }
  return QuestionCircleIcon;
};

const getTitle = (
  bundles: FluentBundle[],
  type: NOTIFICATION_TYPE | null,
  commentReply?: {
    readonly author: { readonly username: string | null } | null;
  } | null
) => {
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
  if (
    type === GQLNOTIFICATION_TYPE.REPLY ||
    type === GQLNOTIFICATION_TYPE.REPLY_STAFF
  ) {
    return getMessage(
      bundles,
      "notifications-yourCommentHasReceivedAReply",
      `New reply from ${commentReply?.author?.username}`,
      { author: commentReply?.author?.username }
    );
  }

  return getMessage(bundles, "notifications-defaultTitle", "Notification");
};

const NotificationContainer: FunctionComponent<Props> = ({
  notification,
  viewer,
  settings,
}) => {
  const { type, createdAt, commentReply } = notification;
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

  // TODO: Update to handle no story url
  const permalinkURL = useMemo(() => {
    const commentURL =
      notification.type === GQLNOTIFICATION_TYPE.REPLY ||
      notification.type === GQLNOTIFICATION_TYPE.REPLY_STAFF
        ? notification.commentReply?.story.url
        : notification.comment?.story.url;
    const commentID =
      notification.type === GQLNOTIFICATION_TYPE.REPLY ||
      notification.type === GQLNOTIFICATION_TYPE.REPLY_STAFF
        ? notification.commentReply?.id
        : notification.comment?.id;
    return getURLWithCommentID(commentURL!, commentID);
  }, [
    notification.type,
    notification.comment?.id,
    notification.comment?.story.url,
    notification.commentReply?.id,
    notification.commentReply?.story.url,
  ]);

  return (
    <a
      className={styles.link}
      href={permalinkURL}
      target="_blank"
      rel="noreferrer"
    >
      <div
        className={cn(styles.root, {
          [styles.seen]: seen,
          [styles.notSeen]: !seen,
        })}
      >
        <div className={styles.title}>
          <SvgIcon size="sm" Icon={getIcon(type)} />
          <div className={styles.titleText}>
            {getTitle(localeBundles, type, commentReply)}
          </div>
          {commentReply && commentReply.author?.badges && (
            <AuthorBadgesContainer
              className={styles.badges}
              badges={commentReply.author.badges}
              settings={settings}
            />
          )}
        </div>
        {(type === GQLNOTIFICATION_TYPE.COMMENT_REJECTED ||
          type === GQLNOTIFICATION_TYPE.ILLEGAL_REJECTED) && (
          <RejectedCommentNotificationBody notification={notification} />
        )}
        {type === GQLNOTIFICATION_TYPE.DSA_REPORT_DECISION_MADE && (
          <DSAReportDecisionMadeNotificationBody notification={notification} />
        )}
        {(type === GQLNOTIFICATION_TYPE.REPLY ||
          type === GQLNOTIFICATION_TYPE.REPLY_STAFF) && (
          <RepliedCommentNotificationBody notification={notification} />
        )}
        {type === GQLNOTIFICATION_TYPE.COMMENT_FEATURED && (
          <FeaturedCommentNotificationBody notification={notification} />
        )}
        {type === GQLNOTIFICATION_TYPE.COMMENT_APPROVED && (
          <ApprovedCommentNotificationBody notification={notification} />
        )}
      </div>
      <div className={styles.divider}></div>
    </a>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment NotificationContainer_viewer on User {
      lastSeenNotificationDate
    }
  `,
  settings: graphql`
    fragment NotificationContainer_settings on Settings {
      ...AuthorBadgesContainer_settings
    }
  `,
  notification: graphql`
    fragment NotificationContainer_notification on Notification {
      type
      id
      createdAt
      type
      commentStatus
      comment {
        id
        story {
          url
        }
        ...NotificationCommentContainer_comment
      }
      commentReply {
        id
        author {
          username
          badges
        }
        story {
          url
        }
      }
      ...RejectedCommentNotificationBody_notification
      ...DSAReportDecisionMadeNotificationBody_notification
      ...RepliedCommentNotificationBody_notification
      ...FeaturedCommentNotificationBody_notification
      ...ApprovedCommentNotificationBody_notification
    }
  `,
})(NotificationContainer);

export default enhanced;
