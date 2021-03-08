import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "relay-runtime";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { UsernameWithPopoverContainer } from "coral-stream/tabs/Comments/Comment/Username";
import { Flex, Icon, Timestamp } from "coral-ui/components/v2";

import { LiveCommentBodyContainer_comment } from "coral-stream/__generated__/LiveCommentBodyContainer_comment.graphql";
import { LiveCommentBodyContainer_settings } from "coral-stream/__generated__/LiveCommentBodyContainer_settings.graphql";
import { LiveCommentBodyContainer_viewer } from "coral-stream/__generated__/LiveCommentBodyContainer_viewer.graphql";

import styles from "./LiveCommentBodyContainer.css";

interface Props {
  comment: LiveCommentBodyContainer_comment;
  settings: LiveCommentBodyContainer_settings;
  viewer: LiveCommentBodyContainer_viewer | null;
}

const LiveCommentBodyContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  viewer,
}) => {
  return (
    <Flex justifyContent="flex-start" alignItems="flex-start">
      {comment.author && comment.author.avatar ? (
        <img
          src={comment.author.avatar}
          className={styles.avatar}
          loading="lazy"
          referrerPolicy="no-referrer"
          alt={`Avatar for ${comment.author.username}`}
        />
      ) : (
        <div className={cn(styles.avatar, styles.emptyAvatar)}>
          <Icon className={styles.avatarIcon}>person</Icon>
        </div>
      )}
      <div className={styles.container}>
        <Flex justifyContent="flex-start" alignItems="center">
          {comment.author && viewer && (
            <UsernameWithPopoverContainer
              className={styles.username}
              usernameClassName={styles.username}
              comment={comment}
              viewer={viewer}
              settings={settings}
            />
          )}
          {comment.author && !viewer && (
            <div className={styles.username}>{comment.author?.username}</div>
          )}
          <Timestamp className={styles.timestamp}>
            {comment.createdAt}
          </Timestamp>
        </Flex>
        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: comment.body || "" }}
        ></div>
      </div>
    </Flex>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LiveCommentBodyContainer_viewer on User {
      id
      ...UsernameWithPopoverContainer_viewer
    }
  `,
  comment: graphql`
    fragment LiveCommentBodyContainer_comment on Comment {
      id
      createdAt
      body
      author {
        id
        username
        avatar
      }
      ...UsernameWithPopoverContainer_comment
    }
  `,
  settings: graphql`
    fragment LiveCommentBodyContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...LiveCommentActionsContainer_settings
      ...UsernameWithPopoverContainer_settings
    }
  `,
})(LiveCommentBodyContainer);

export default enhanced;
