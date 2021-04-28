import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useMemo, useRef } from "react";
import { graphql } from "react-relay";

import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import { useToggleState } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLCOMMENT_STATUS } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { ReportFlowContainer } from "coral-stream/tabs/shared/ReportFlow";
import { Flex } from "coral-ui/components/v2";
import { Button, Tombstone } from "coral-ui/components/v3";

import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";
import { LiveCommentContainer_settings } from "coral-stream/__generated__/LiveCommentContainer_settings.graphql";
import { LiveCommentContainer_story } from "coral-stream/__generated__/LiveCommentContainer_story.graphql";
import { LiveCommentContainer_viewer } from "coral-stream/__generated__/LiveCommentContainer_viewer.graphql";

import ShortcutIcon from "../Icons/ShortcutIcon";
import InView from "../InView";
import LiveCommentActionsContainer from "./LiveCommentActionsContainer";
import LiveCommentBodyContainer from "./LiveCommentBodyContainer";

import styles from "./LiveCommentContainer.css";

export enum CommentPosition {
  Unknown = 0,
  Before = 1,
  After = 2,
}

interface Props {
  story: LiveCommentContainer_story;
  viewer: LiveCommentContainer_viewer | null;
  comment: LiveCommentContainer_comment;
  cursor: string;
  settings: LiveCommentContainer_settings;
  onInView: (
    visible: boolean,
    id: string,
    createdAt: string,
    cursor: string,
    position: CommentPosition
  ) => void;

  onShowConversation: (comment: LiveCommentContainer_comment) => void;
  onShowParentConversation: (
    parent: NonNullable<LiveCommentContainer_comment["parent"]>
  ) => void;
  onReplyToComment: (comment: LiveCommentContainer_comment) => void;
  onReplyToParent: (
    parent: NonNullable<LiveCommentContainer_comment["parent"]>,
    comment: LiveCommentContainer_comment
  ) => void;

  onEdit?: (comment: LiveCommentContainer_comment) => void;
  editing?: boolean;
  onCancelEditing?: () => void;
  position: CommentPosition;
}

const LiveCommentContainer: FunctionComponent<Props> = ({
  story,
  comment,
  cursor,
  viewer,
  settings,
  onInView,
  onShowConversation,
  onShowParentConversation,
  onReplyToComment,
  onReplyToParent,
  onEdit,
  editing,
  onCancelEditing,
  position,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);

  const ignored = Boolean(
    comment.author &&
      viewer &&
      viewer.ignoredUsers.some((u) => Boolean(u.id === comment.author!.id))
  );

  const isReplyToViewer = comment.parent?.author?.id === viewer?.id;

  const handleInView = useCallback(
    (visible: boolean) => {
      onInView(visible, comment.id, comment.createdAt, cursor, position);
    },
    [comment.createdAt, comment.id, cursor, onInView, position]
  );

  const handleOnShowParentConversation = useCallback(() => {
    const parent = comment.parent;
    if (!parent) {
      return;
    }

    onShowParentConversation(parent);
  }, [comment.parent, onShowParentConversation]);

  const handleOnConversation = useCallback(() => {
    onShowConversation(comment);
  }, [comment, onShowConversation]);

  const handleOnReply = useCallback(() => {
    const parent = comment.parent;
    if (parent) {
      onReplyToParent(parent, comment);
    } else {
      onReplyToComment(comment);
    }
  }, [comment, onReplyToComment, onReplyToParent]);

  const handleOnEdit = useCallback(() => {
    if (!onEdit) {
      return;
    }

    onEdit(comment);
  }, [onEdit, comment]);

  const commentBodyAndActions = useMemo(() => {
    return (
      <>
        <LiveCommentBodyContainer
          comment={comment}
          settings={settings}
          viewer={viewer}
          story={story}
          containerClassName={editing ? styles.highlight : ""}
          onCancel={editing ? onCancelEditing : undefined}
        />

        <div id={`comment-${comment.id}`}>
          {!editing && (
            <LiveCommentActionsContainer
              story={story}
              comment={comment}
              viewer={viewer}
              settings={settings}
              onReply={handleOnReply}
              onConversation={handleOnConversation}
              onToggleReport={toggleShowReportFlow}
              onEdit={editing ? undefined : handleOnEdit}
              showReport={showReportFlow}
            />
          )}
        </div>
        {showReportFlow && (
          <ReportFlowContainer
            viewer={viewer}
            comment={comment}
            settings={settings}
            onClose={toggleShowReportFlow}
          />
        )}
      </>
    );
  }, [
    comment,
    editing,
    handleOnConversation,
    handleOnEdit,
    handleOnReply,
    onCancelEditing,
    settings,
    showReportFlow,
    story,
    toggleShowReportFlow,
    viewer,
  ]);

  if (ignored) {
    return (
      <Tombstone
        className={cn(CLASSES.ignoredTombstone, styles.tombstone)}
        fullWidth
      >
        <Localized
          id="comments-tombstone-ignore"
          $username={comment.author!.username}
        >
          <span>
            This comment is hidden because you ignored{" "}
            {comment.author!.username}
          </span>
        </Localized>
      </Tombstone>
    );
  }

  if (comment.status === GQLCOMMENT_STATUS.REJECTED) {
    return (
      <Tombstone
        className={cn(CLASSES.rejectedTombstone, styles.tombstone)}
        fullWidth
      >
        <Localized id="liveChat-tombstone-rejected">
          <span>
            This comment has been removed because it violated our commenting
            guidelines
          </span>
        </Localized>
      </Tombstone>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        styles.root,
        editing ? styles.highlight : "",
        CLASSES.comment.$root,
        `${CLASSES.comment.reacted}-${comment.actionCounts.reaction.total}`
      )}
      id={`comment-${comment.id}-top`}
    >
      <div className={styles.comment}>
        <InView onInView={handleInView} />
        {comment.parent && (
          <div
            className={cn(styles.parent, {
              [styles.parentHighlight]: isReplyToViewer,
            })}
          >
            <Flex justifyContent="flex-start" alignItems="center">
              <ShortcutIcon
                className={cn({
                  [styles.parentArrow]: !isReplyToViewer,
                  [styles.parentArrowHighlight]: isReplyToViewer,
                })}
              />
              <Button
                variant="none"
                paddingSize="none"
                fontFamily="none"
                fontSize="none"
                fontWeight="none"
                textAlign="left"
                onClick={handleOnShowParentConversation}
              >
                <Flex
                  justifyContent="flex-start"
                  alignItems="center"
                  className={styles.parentButton}
                >
                  <div
                    className={cn({
                      [styles.parentUser]: !isReplyToViewer,
                      [styles.parentUserHighlight]: isReplyToViewer,
                    })}
                  >
                    {comment.parent.author?.username}:
                  </div>
                  <div
                    className={cn({
                      [styles.parentBody]: !isReplyToViewer,
                      [styles.parentBodyHighlight]: isReplyToViewer,
                    })}
                  >
                    {getHTMLPlainText(comment.parent?.body || "")}
                  </div>
                </Flex>
              </Button>
            </Flex>
          </div>
        )}

        <Flex>
          {isReplyToViewer && <div className={styles.replyToViewerBar}></div>}
          <div
            className={cn(styles.bodyAndActions, {
              [styles.paddedBodyAndActions]: isReplyToViewer,
            })}
          >
            {commentBodyAndActions}
          </div>
        </Flex>
      </div>
      <div id={`comment-${comment.id}-bottom`}></div>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveCommentContainer_story on Story {
      ...LiveCommentActionsContainer_story
      ...LiveCommentBodyContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveCommentContainer_viewer on User {
      id
      ignoredUsers {
        id
      }
      ...ReportFlowContainer_viewer
      ...LiveCommentActionsContainer_viewer
      ...LiveCommentBodyContainer_viewer
    }
  `,
  comment: graphql`
    fragment LiveCommentContainer_comment on Comment {
      id
      author {
        id
        username
      }
      body
      createdAt
      parent {
        id
        author {
          id
          username
        }
        body
        ...LiveConversationQuery_comment
      }
      actionCounts {
        reaction {
          total
        }
      }
      status
      ...ReportFlowContainer_comment
      ...LiveCommentActionsContainer_comment
      ...LiveCommentBodyContainer_comment
      ...LiveEditCommentFormContainer_comment
      ...LiveConversationQuery_comment
    }
  `,
  settings: graphql`
    fragment LiveCommentContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...LiveCommentActionsContainer_settings
      ...LiveCommentBodyContainer_settings
    }
  `,
})(LiveCommentContainer);

export default enhanced;
