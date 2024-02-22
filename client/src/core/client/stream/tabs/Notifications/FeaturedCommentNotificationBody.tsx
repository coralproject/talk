import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { FeaturedCommentNotificationBody_notification } from "coral-stream/__generated__/FeaturedCommentNotificationBody_notification.graphql";

import styles from "./FeaturedCommentNotificationBody.css";

import NotificationCommentContainer from "./NotificationCommentContainer";

interface Props {
  notification: FeaturedCommentNotificationBody_notification;
}

const FeaturedCommentNotificationBody: FunctionComponent<Props> = ({
  notification,
}) => {
  const { comment } = notification;

  if (!comment) {
    return null;
  }

  return (
    <div className={styles.body}>
      {comment && (
        <div>
          <NotificationCommentContainer
            comment={comment}
            notification={notification}
          />
        </div>
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment FeaturedCommentNotificationBody_notification on Notification {
      ...NotificationCommentContainer_notification
      comment {
        ...NotificationCommentContainer_comment
      }
    }
  `,
})(FeaturedCommentNotificationBody);

export default enhanced;
