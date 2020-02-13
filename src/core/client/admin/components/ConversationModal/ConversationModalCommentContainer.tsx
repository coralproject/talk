// import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, Timestamp } from "coral-ui/components/v2";

import { ConversationModalCommentContainer_comment } from "coral-admin/__generated__/ConversationModalCommentContainer_comment.graphql";

import { CommentContent, InReplyTo, UsernameButton } from "../Comment";

import styles from "./ConversationModalCommentContainer.css";

interface Props {
  comment: ConversationModalCommentContainer_comment;
  isHighlighted: boolean;
  onUsernameClick: (id?: string) => void;
}

const ConversationModalCommentContainer: FunctionComponent<Props> = ({
  comment,
  isHighlighted,
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
    <div
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
            <div className={styles.inReplyTo}>
              <InReplyTo onUsernameClick={commentParentAuthorClick}>
                {comment.parent.author.username}
              </InReplyTo>
            </div>
          )}
      </div>

      <div>
        {comment.body && (
          <CommentContent suspectWords={[]} bannedWords={[]}>
            {comment.body}
          </CommentContent>
        )}
      </div>
    </div>
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
