import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql, useFragment } from "react-relay";

import { MediaContainer } from "coral-admin/components/MediaContainer";
import {
  Button,
  Flex,
  HorizontalGutter,
  Timestamp,
} from "coral-ui/components/v2";

import { ConversationModalCommentContainer_comment$key as ConversationModalCommentContainer_comment } from "coral-admin/__generated__/ConversationModalCommentContainer_comment.graphql";
import { ConversationModalCommentContainer_settings$key as ConversationModalCommentContainer_settings } from "coral-admin/__generated__/ConversationModalCommentContainer_settings.graphql";

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
  const commentData = useFragment(
    graphql`
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
    comment
  );
  useFragment(
    graphql`
      fragment ConversationModalCommentContainer_settings on Settings {
        multisite
        featureFlags
        ...MarkersContainer_settings
      }
    `,
    settings
  );

  const commentAuthorClick = useCallback(() => {
    if (commentData.author) {
      onUsernameClick(commentData.author.id);
    }
  }, [onUsernameClick, commentData.author]);
  const commentParentAuthorClick = useCallback(() => {
    if (commentData.parent && commentData.parent.author) {
      onUsernameClick(commentData.parent.author.id);
    }
  }, [onUsernameClick, commentData.parent]);
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
              {commentData.author && commentData.author.username && (
                <UsernameButton
                  onClick={commentAuthorClick}
                  username={commentData.author.username}
                />
              )}
              <Timestamp>{commentData.createdAt}</Timestamp>
            </Flex>
            {commentData.parent &&
              commentData.parent.author &&
              commentData.parent.author.username && (
                <InReplyTo onUsernameClick={commentParentAuthorClick}>
                  {commentData.parent.author.username}
                </InReplyTo>
              )}
          </div>

          <div>
            {commentData.body && (
              <CommentContent className={styles.commentText}>
                {commentData.body}
              </CommentContent>
            )}
            <MediaContainer comment={commentData} />
          </div>
        </HorizontalGutter>
      </Flex>
      {isReply && commentData.replyCount > 0 && (
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
              commentID={commentData.id}
            />
          )}
        </div>
      )}
    </HorizontalGutter>
  );
};

export default ConversationModalCommentContainer;
