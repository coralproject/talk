import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { RepliedCommentNotificationBody_notification } from "coral-stream/__generated__/RepliedCommentNotificationBody_notification.graphql";

import styles from "./RepliedCommentNotificationBody.css";

import NotificationCommentContainer from "./NotificationCommentContainer";

interface Props {
  notification: RepliedCommentNotificationBody_notification;
}

const RepliedCommentNotificationBody: FunctionComponent<Props> = ({
  notification,
}) => {
  const { comment, commentReply } = notification;
  if (!commentReply) {
    return null;
  }

  return (
    <div className={styles.body}>
      {comment && (
        <div>
          <NotificationCommentContainer
            comment={commentReply}
            notification={notification}
          />
        </div>
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment RepliedCommentNotificationBody_notification on Notification {
      ...NotificationCommentContainer_notification
      comment {
        ...NotificationCommentContainer_comment
      }
      commentReply {
        ...NotificationCommentContainer_comment
      }
    }
  `,
})(RepliedCommentNotificationBody);

export default enhanced;
