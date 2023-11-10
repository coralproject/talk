import cn from "classnames";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import HTMLContent from "coral-stream/common/HTMLContent";
import { CheckCircleIcon, SvgIcon } from "coral-ui/components/icons";
import { Timestamp } from "coral-ui/components/v2";

import { NotificationContainer_notification } from "coral-stream/__generated__/NotificationContainer_notification.graphql";
import { NotificationContainer_viewer } from "coral-stream/__generated__/NotificationContainer_viewer.graphql";

import NotificationCommentContainer from "./NotificationCommentContainer";

import styles from "./NotificationContainer.css";

interface Props {
  viewer: NotificationContainer_viewer | null;
  notification: NotificationContainer_notification;
}

const NotificationContainer: FunctionComponent<Props> = ({
  notification: { title, body, comment, createdAt, commentStatus },
  viewer,
}) => {
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
        {title && (
          <div className={styles.title}>
            <SvgIcon size="sm" Icon={CheckCircleIcon} />
            <div className={styles.titleText}>{title}</div>
          </div>
        )}
        {body && (
          <div className={cn(styles.body)}>
            <HTMLContent>{body || ""}</HTMLContent>
          </div>
        )}
        {comment && (
          <div className={styles.contextItem}>
            <NotificationCommentContainer
              comment={comment}
              status={commentStatus ? commentStatus : comment.status}
            />
          </div>
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
      title
      body
      comment {
        ...NotificationCommentContainer_comment
        status
      }
      commentStatus
    }
  `,
})(NotificationContainer);

export default enhanced;
