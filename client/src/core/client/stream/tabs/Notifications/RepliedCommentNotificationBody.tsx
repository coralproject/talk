import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

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
              openedStateText={<Localized id="">- Hide the reply</Localized>}
              closedStateText={<Localized id="">+ Show the reply</Localized>}
              expanded
            />
          </div>
          <Flex marginTop={1} marginBottom={1}>
            <Localized id="">
              <Button
                className={styles.goToReplyButton}
                variant="none"
                href={permalinkURL}
                target="_blank"
              >
                Open this comment
              </Button>
            </Localized>
            <div className={styles.readInContext}>
              to read in context or reply
            </div>
          </Flex>
          <NotificationCommentContainer
            comment={comment}
            openedStateText={
              <Localized id="">- Hide my original comment</Localized>
            }
            closedStateText={
              <Localized id="">+ Show my original comment</Localized>
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
