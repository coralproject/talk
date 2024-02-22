import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { CommentNotificationBody_notification } from "coral-stream/__generated__/CommentNotificationBody_notification.graphql";

import styles from "./CommentNotificationBody.css";

import NotificationCommentContainer from "./NotificationCommentContainer";

interface Props {
  notification: CommentNotificationBody_notification;
  reply: boolean;
}

const CommentNotificationBody: FunctionComponent<Props> = ({
  notification,
  reply,
}) => {
  const { comment, commentReply } = notification;

  const commentToUse = reply ? commentReply : comment;

  if (!commentToUse) {
    return null;
  }

  return (
    <div className={styles.body}>
      <div>
        <NotificationCommentContainer
          comment={commentToUse}
          notification={notification}
        />
      </div>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment CommentNotificationBody_notification on Notification {
      ...NotificationCommentContainer_notification
      comment {
        ...NotificationCommentContainer_comment
      }
      commentReply {
        ...NotificationCommentContainer_comment
      }
    }
  `,
})(CommentNotificationBody);

export default enhanced;
