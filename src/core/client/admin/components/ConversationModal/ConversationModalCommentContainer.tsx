// import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, HorizontalGutter, Timestamp } from "coral-ui/components/v2";

import { ConversationModalCommentContainer_comment } from "coral-admin/__generated__/ConversationModalCommentContainer_comment.graphql";

import { CommentContent, InReplyTo, UsernameButton } from "../Comment";
import { Circle, Line } from "../Timeline";

import styles from "./ConversationModalCommentContainer.css";

interface Props {
  comment: ConversationModalCommentContainer_comment;
  isHighlighted: boolean;
  onUsernameClick: (id?: string) => void;
  isParent?: boolean;
  isReply?: boolean;
}

const ConversationModalCommentContainer: FunctionComponent<Props> = ({
  comment,
  isHighlighted,
  isParent,
  isReply,
  onUsernameClick,
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
  return (
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
            <CommentContent
              className={styles.commentText}
              suspectWords={[]}
              bannedWords={[]}
            >
              {comment.body}
            </CommentContent>
          )}
        </div>
      </HorizontalGutter>
    </Flex>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ConversationModalCommentContainer_comment on Comment {
      id
      body
      createdAt
      author {
        username
        id
      }
      parent {
        author {
          username
          id
        }
      }
    }
  `,
})(ConversationModalCommentContainer);

export default enhanced;
