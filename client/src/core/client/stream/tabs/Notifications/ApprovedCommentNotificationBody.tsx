import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { ApprovedCommentNotificationBody_notification } from "coral-stream/__generated__/ApprovedCommentNotificationBody_notification.graphql";

import styles from "./ApprovedCommentNotificationBody.css";

import GoToCommentButton from "./GoToCommentButton";
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
          <div className={styles.commentSection}>
            <Localized
              id="notifications-approvedComment-description"
              vars={{ title: comment.story.metadata?.title }}
            >
              <div className={styles.replyInfo}>
                Your comment on the article "{comment.story.metadata?.title}"
                has been approved by a member of our team.
              </div>
            </Localized>
            <NotificationCommentContainer
              comment={comment}
              openedStateText={
                <Localized id="notifications-comment-hide">
                  - Hide your comment
                </Localized>
              }
              closedStateText={
                <Localized id="notifications-comment-show">
                  + Show your comment
                </Localized>
              }
              expanded
            />
          </div>
          <GoToCommentButton
            commentID={comment.id}
            commentStoryURL={comment.story.url}
          />
        </>
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment ApprovedCommentNotificationBody_notification on Notification {
      type
      comment {
        id
        ...NotificationCommentContainer_comment
        story {
          url
          metadata {
            title
          }
        }
      }
    }
  `,
})(ApprovedCommentNotificationBody);

export default enhanced;
