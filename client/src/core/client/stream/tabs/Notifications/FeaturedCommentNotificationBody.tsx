import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

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

  const permalinkURL = getURLWithCommentID(comment.story.url, comment.id);

  return (
    <div className={styles.body}>
      {comment && (
        <>
          <div className={styles.commentSection}>
            <Localized
              id="notifications-featuredComment-description"
              vars={{ title: comment.story.metadata?.title }}
            >
              <div className={styles.replyInfo}>
                Your comment on the article "{comment.story.metadata?.title}"
                has been featured by a member of our team.
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
          <Flex marginTop={1} marginBottom={2}>
            <Localized id="">
              <Button
                className={styles.goToReplyButton}
                variant="none"
                href={permalinkURL}
                target="_blank"
              >
                Go to this comment
              </Button>
            </Localized>
            <div className={styles.readInContext}>
              to read in context or reply
            </div>
          </Flex>
        </>
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  notification: graphql`
    fragment FeaturedCommentNotificationBody_notification on Notification {
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
})(FeaturedCommentNotificationBody);

export default enhanced;
