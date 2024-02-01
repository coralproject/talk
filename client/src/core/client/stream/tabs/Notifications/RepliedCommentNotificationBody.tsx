import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { RepliedCommentNotificationBody_notification } from "coral-stream/__generated__/RepliedCommentNotificationBody_notification.graphql";

import styles from "./RepliedCommentNotificationBody.css";

import GoToCommentButton from "./GoToCommentButton";
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
        <>
          <div className={styles.commentSection}>
            <Localized
              id="notifications-repliedComment-description"
              vars={{
                title: commentReply.story.metadata?.title,
                username: commentReply.author?.username ?? "",
              }}
              elems={{
                author: <span className={styles.author}></span>,
              }}
            >
              <div className={styles.replyInfo}>
                Your comment on the article "
                {commentReply.story.metadata?.title}" received a reply from
                <span className={styles.author}>
                  {" "}
                  {commentReply.author?.username ?? ""}
                </span>
              </div>
            </Localized>
            <NotificationCommentContainer
              comment={commentReply}
              openedStateText={
                <Localized id="notifications-repliedComment-hideReply">
                  - Hide the reply
                </Localized>
              }
              closedStateText={
                <Localized id="notifications-repliedComment-showReply">
                  + Show the reply
                </Localized>
              }
              expanded
            />
          </div>
          <GoToCommentButton
            commentID={commentReply.id}
            commentStoryURL={commentReply.story.url}
          />
          <NotificationCommentContainer
            comment={comment}
            openedStateText={
              <Localized id="notifications-repliedComment-hideOriginalComment">
                - Hide my original comment
              </Localized>
            }
            closedStateText={
              <Localized id="notifications-repliedComment-showOriginalComment">
                + Show my original comment
              </Localized>
            }
          />
        </>
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment RepliedCommentNotificationBody_notification on Notification {
      type
      comment {
        ...NotificationCommentContainer_comment
      }
      commentReply {
        ...NotificationCommentContainer_comment
        id
        author {
          username
        }
        story {
          url
          metadata {
            title
          }
        }
      }
    }
  `,
})(RepliedCommentNotificationBody);

export default enhanced;
