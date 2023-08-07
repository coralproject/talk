import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { useRouter } from "found";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { graphql } from "react-relay";

import { MediaContainer } from "coral-admin/components/MediaContainer";
import { RejectCommentMutation } from "coral-admin/mutations";
import { parseModerationOptions } from "coral-framework/helpers";
import {
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { RemoveIcon, SvgIcon } from "coral-ui/components/icons";
import {
  Button,
  Flex,
  HorizontalGutter,
  Timestamp,
} from "coral-ui/components/v2";

import { ConversationModalCommentContainer_comment } from "coral-admin/__generated__/ConversationModalCommentContainer_comment.graphql";
import { ConversationModalCommentContainerLocal } from "coral-admin/__generated__/ConversationModalCommentContainerLocal.graphql";

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
}

const ConversationModalCommentContainer: FunctionComponent<Props> = ({
  comment,
  isHighlighted,
  isParent,
  isReply,
  onUsernameClick,
}) => {
  const rejectComment = useMutation(RejectCommentMutation);
  const { match } = useRouter();
  const { storyID, siteID, section } = parseModerationOptions(match);
  const [{ moderationQueueSort }] =
    useLocal<ConversationModalCommentContainerLocal>(graphql`
      fragment ConversationModalCommentContainerLocal on Local {
        moderationQueueSort
      }
    `);
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
  const onRejectComment = useCallback(async () => {
    if (!comment.revision) {
      return;
    }
    await rejectComment({
      commentID: comment.id,
      commentRevisionID: comment.revision.id,
      storyID,
      siteID,
      section,
      orderBy: moderationQueueSort,
    });
  }, [
    comment.id,
    comment.revision,
    match,
    moderationQueueSort,
    rejectComment,
    storyID,
    siteID,
    section,
  ]);
  const rejectButtonOptions = useMemo((): {
    localization: string;
    variant: "regular" | "outlined";
    ariaLabel: string;
    text: string;
    disabled: boolean;
  } => {
    if (comment.status === "REJECTED") {
      return {
        localization: "conversation-modal-rejectButton-rejected",
        variant: "regular",
        ariaLabel: "Rejected",
        text: "Rejected",
        disabled: true,
      };
    }
    return {
      localization: "conversation-modal-rejectButton",
      variant: "outlined",
      ariaLabel: "Reject",
      text: "Reject",
      disabled: false,
    };
  }, [comment.status]);
  return (
    <HorizontalGutter data-testid={`conversation-modal-comment-${comment.id}`}>
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
          <Flex>
            <Flex className={styles.commentWrapper}>
              <Flex direction="column">
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
              </Flex>
            </Flex>
            <Flex>
              <Localized
                id={rejectButtonOptions.localization}
                attrs={{ "aria-label": true }}
                elems={{ icon: <SvgIcon size="xs" Icon={RemoveIcon} /> }}
              >
                <Button
                  className={styles.rejectButton}
                  color="alert"
                  variant={rejectButtonOptions.variant}
                  iconLeft
                  disabled={rejectButtonOptions.disabled}
                  onClick={onRejectComment}
                  aria-label={rejectButtonOptions.ariaLabel}
                >
                  <SvgIcon size="xs" Icon={RemoveIcon} />
                  {rejectButtonOptions.text}
                </Button>
              </Localized>
            </Flex>
          </Flex>
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
  comment: graphql`
    fragment ConversationModalCommentContainer_comment on Comment {
      id
      body
      createdAt
      author {
        username
        id
      }
      revision {
        id
      }
      status
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
