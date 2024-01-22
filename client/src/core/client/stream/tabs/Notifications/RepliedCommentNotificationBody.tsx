import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";
import HTMLContent from "coral-stream/common/HTMLContent";
import { Button } from "coral-ui/components/v3";

import { RepliedCommentNotificationBody_notification } from "coral-stream/__generated__/RepliedCommentNotificationBody_notification.graphql";

import styles from "./RepliedCommentNotificationBody.css";

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

  const permalinkURL = getURLWithCommentID(
    commentReply.story.url,
    commentReply.id
  );

  return (
    <div className={styles.body}>
      {comment && (
        <>
          <div className={styles.commentSection}>
            <Localized id="">
              <div className={styles.replyInfo}>
                {commentReply.author?.username ?? ""} replied to your comment on{" "}
                {commentReply.story.metadata?.title}:
              </div>
            </Localized>
            <div className={styles.commentBody}>
              <HTMLContent>{commentReply.body || ""}</HTMLContent>
            </div>
          </div>
          <div className={styles.commentSection}>
            <Localized id="">
              <div className={styles.replyInfo}>In reply to:</div>
            </Localized>
            <div className={styles.commentBody}>
              <HTMLContent>{comment.body || ""}</HTMLContent>
            </div>
          </div>
          <Localized id="">
            <Button
              className={styles.goToReplyButton}
              variant="none"
              href={permalinkURL}
              target="_blank"
            >
              Go to reply
            </Button>
          </Localized>
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
        body
      }
      commentReply {
        id
        author {
          username
        }
        body
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
