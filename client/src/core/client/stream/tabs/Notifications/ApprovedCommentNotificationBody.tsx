import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { ApprovedCommentNotificationBody_notification } from "coral-stream/__generated__/ApprovedCommentNotificationBody_notification.graphql";

import styles from "./ApprovedCommentNotificationBody.css";

import NotificationCommentContainer from "./NotificationCommentContainer";

interface Props {
  notification: ApprovedCommentNotificationBody_notification;
}

const ApprovedCommentNotificationBody: FunctionComponent<Props> = ({
  notification,
}) => {
  const { comment } = notification;

  if (!comment) {
    return null;
  }

  return (
    <div className={styles.body}>
      {comment && (
        <>
          <div>
            <NotificationCommentContainer
              comment={comment}
              notification={notification}
            />
          </div>
        </>
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment ApprovedCommentNotificationBody_notification on Notification {
      ...NotificationCommentContainer_notification
      type
      comment {
        id
        ...NotificationCommentContainer_comment
        story {
          url
        }
      }
    }
  `,
})(ApprovedCommentNotificationBody);

export default enhanced;
