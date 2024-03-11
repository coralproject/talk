import { FluentBundle } from "@fluent/bundle/compat";
import cn from "classnames";
import React, { ComponentType, FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLNOTIFICATION_TYPE, GQLTAG_RL } from "coral-framework/schema";
import {
  CheckCircleIcon,
  LegalHammerIcon,
  MessagesBubbleSquareTextIcon,
  QuestionCircleIcon,
  RatingStarRibbonIcon,
  RejectCommentBoxIcon,
  SvgIcon,
} from "coral-ui/components/icons";

import {
  NOTIFICATION_TYPE,
  NotificationContainer_notification,
} from "coral-stream/__generated__/NotificationContainer_notification.graphql";
import { NotificationContainer_settings } from "coral-stream/__generated__/NotificationContainer_settings.graphql";
import { NotificationContainer_viewer } from "coral-stream/__generated__/NotificationContainer_viewer.graphql";

import BadgeTagContainer from "../Comments/Comment/BadgeTagContainer";
import CommentNotificationBody from "./CommentNotificationBody";
import DSAReportDecisionMadeNotificationBody from "./DSAReportDecisionMadeNotificationBody";
import RejectedCommentNotificationBody from "./RejectedCommentNotificationBody";

import styles from "./NotificationContainer.css";

interface Props {
  viewer: NotificationContainer_viewer | null;
  notification: NotificationContainer_notification;
  settings: NotificationContainer_settings;
}

function tagStrings(
  comment: NotificationContainer_notification["commentReply"]
): GQLTAG_RL[] {
  return comment?.tags.map((t) => t.code) ?? [];
}

const getIcon = (type: NOTIFICATION_TYPE | null): ComponentType => {
  if (type === GQLNOTIFICATION_TYPE.COMMENT_APPROVED) {
    return CheckCircleIcon;
  }
  if (type === GQLNOTIFICATION_TYPE.COMMENT_FEATURED) {
    return RatingStarRibbonIcon;
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
      "Your comment has been published"
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

  const permalinkURL = useMemo(() => {
    if (notification.type === GQLNOTIFICATION_TYPE.COMMENT_REJECTED) {
      return undefined;
    }
    const commentForPermalink =
      notification.type === GQLNOTIFICATION_TYPE.REPLY ||
      notification.type === GQLNOTIFICATION_TYPE.REPLY_STAFF
        ? notification.commentReply
        : notification.comment;
    return commentForPermalink?.story.url
      ? getURLWithCommentID(
          commentForPermalink?.story.url,
          commentForPermalink?.id
        )
      : undefined;
  }, [notification.type, notification.comment, notification.commentReply]);

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
          {type === GQLNOTIFICATION_TYPE.REPLY_STAFF && (
            <BadgeTagContainer
              settings={settings}
              tags={tagStrings(commentReply)}
              className={styles.badges}
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
          type === GQLNOTIFICATION_TYPE.REPLY_STAFF ||
          type === GQLNOTIFICATION_TYPE.COMMENT_FEATURED ||
          type === GQLNOTIFICATION_TYPE.COMMENT_APPROVED) && (
          <CommentNotificationBody
            notification={notification}
            reply={
              type === GQLNOTIFICATION_TYPE.REPLY ||
              type === GQLNOTIFICATION_TYPE.REPLY_STAFF
            }
          />
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
      ...BadgeTagContainer_settings
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
        tags {
          code
        }
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
      ...CommentNotificationBody_notification
    }
  `,
})(NotificationContainer);

export default enhanced;
