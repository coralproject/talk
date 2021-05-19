import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { MediaContainer } from "coral-admin/components/MediaContainer";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  Button,
  Flex,
  HorizontalGutter,
  Timestamp,
} from "coral-ui/components/v2";

import { ConversationModalCommentContainer_comment } from "coral-admin/__generated__/ConversationModalCommentContainer_comment.graphql";
import { ConversationModalCommentContainer_settings } from "coral-admin/__generated__/ConversationModalCommentContainer_settings.graphql";

import { CommentContent, InReplyTo, UsernameButton } from "../Comment";
import { Circle, Line } from "../Timeline";
import ConversationModalRepliesQuery from "./ConversationModalRepliesQuery";

import styles from "./ConversationModalCommentContainer.css";

interface Props {
  comment: ConversationModalCommentContainer_comment;
  isHighlighted: boolean;
  onUsernameClick: (id?: string) => void;
  isParent?: boolean;
  isReply?: boolean;
  settings: ConversationModalCommentContainer_settings;
}

const ConversationModalCommentContainer: FunctionComponent<Props> = ({
  comment,
  isHighlighted,
  isParent,
  isReply,
  onUsernameClick,
  settings,
}) => {
  const commentAuthorClick = useCallback(() => {
    if (comment.author) {
      onUsernameClick(comment.author.id);
    }
  }, [onUsernameClick, comment.author]);
  const commentParentAuthorClick = useCallback(() => {
    if (comment.parent && comment.parent.author) {
      onUsernameClick(comment.parent.author.id);
    }
  }, [onUsernameClick, comment.parent]);
  const [showReplies, setShowReplies] = useState(false);
  const onShowReplies = useCallback(() => {
    setShowReplies(true);
  }, []);
  return (
    <HorizontalGutter>
      <Flex>
        <Flex
          direction="column"
          alignItems="center"
          className={cn(styles.adornments, {
            [styles.highlightedCircle]: isHighlighted,
          })}
        >
          {!isReply && <Circle className={styles.circle} />}
          {(isParent || isReply) && <Line className={styles.line} />}
        </Flex>
        <HorizontalGutter
          spacing={1}
          className={cn(styles.root, {
            [styles.highlighted]: isHighlighted,
          })}
        >
          <div>
            <Flex alignItems="center">
              {comment.author && comment.author.username && (
                <UsernameButton
                  onClick={commentAuthorClick}
                  username={comment.author.username}
                />
              )}
              <Timestamp>{comment.createdAt}</Timestamp>
            </Flex>
            {comment.parent &&
              comment.parent.author &&
              comment.parent.author.username && (
                <InReplyTo onUsernameClick={commentParentAuthorClick}>
                  {comment.parent.author.username}
                </InReplyTo>
              )}
          </div>

          <div>
            {comment.body && (
              <CommentContent className={styles.commentText}>
                {comment.body}
              </CommentContent>
            )}
            <MediaContainer comment={comment} />
          </div>
        </HorizontalGutter>
      </Flex>
      {isReply && comment.replyCount > 0 && (
        <div className={styles.showReplies}>
          {!showReplies && (
            <Localized id="conversation-modal-showReplies">
              <Button
                color="mono"
                variant="outlined"
                onClick={onShowReplies}
                fullWidth
              >
                Show replies
              </Button>
            </Localized>
          )}
          {showReplies && (
            <ConversationModalRepliesQuery
              onUsernameClicked={onUsernameClick}
              commentID={comment.id}
            />
          )}
        </div>
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ConversationModalCommentContainer_settings on Settings {
      multisite
      featureFlags
      ...MarkersContainer_settings
    }
  `,
  comment: graphql`
    fragment ConversationModalCommentContainer_comment on Comment {
      id
      body
      createdAt
      author {
        username
        id
      }
      replyCount
      parent {
        author {
          username
          id
        }
      }
      ...MediaContainer_comment
    }
  `,
})(ConversationModalCommentContainer);

export default enhanced;
