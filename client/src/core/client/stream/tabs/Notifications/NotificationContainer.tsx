import cn from "classnames";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { NotificationContainer_notification } from "coral-stream/__generated__/NotificationContainer_notification.graphql";
import { NotificationContainer_viewer } from "coral-stream/__generated__/NotificationContainer_viewer.graphql";

import styles from "./NotificationContainer.css";

interface Props {
  viewer: NotificationContainer_viewer | null;
  notification: NotificationContainer_notification;
}

const NotificationContainer: FunctionComponent<Props> = ({
  notification: { title, body, comment, createdAt },
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

  const commentURL = comment
    ? getURLWithCommentID(comment.story.url, comment.id)
    : "";

  return (
    <div
      className={cn(styles.root, {
        [styles.seen]: seen,
        [styles.notSeen]: !seen,
      })}
    >
      {title && <div className={cn(styles.title)}>{title}</div>}
      {body && <div className={cn(styles.body)}>{body}</div>}
      {comment && <a href={commentURL}>{commentURL}</a>}
    </div>
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
        id
        story {
          url
        }
      }
    }
  `,
})(NotificationContainer);

export default enhanced;
