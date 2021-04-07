import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useRef } from "react";
import { graphql } from "react-relay";

import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import { useToggleState } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { ReportFlowContainer } from "coral-stream/tabs/shared/ReportFlow";
import { Flex } from "coral-ui/components/v2";
import { Button, Tombstone } from "coral-ui/components/v3";

import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";
import { LiveCommentContainer_settings } from "coral-stream/__generated__/LiveCommentContainer_settings.graphql";
import { LiveCommentContainer_story } from "coral-stream/__generated__/LiveCommentContainer_story.graphql";
import { LiveCommentContainer_viewer } from "coral-stream/__generated__/LiveCommentContainer_viewer.graphql";

import InView from "../InView";
import ShortcutIcon from "../ShortcutIcon";
import LiveCommentActionsContainer from "./LiveCommentActionsContainer";
import LiveCommentBodyContainer from "./LiveCommentBodyContainer";

import styles from "./LiveCommentContainer.css";

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
    cursor: string
  ) => void;

  onShowConversation: (comment: LiveCommentContainer_comment) => void;
  onShowParentConversation: (
    parent: NonNullable<LiveCommentContainer_comment["parent"]>
  ) => void;
  onReplyToComment: (comment: LiveCommentContainer_comment) => void;
  onReplyToParent: (
    parent: NonNullable<LiveCommentContainer_comment["parent"]>
  ) => void;

  onEdit?: (comment: LiveCommentContainer_comment) => void;
  editing?: boolean;
  onCancelEditing?: () => void;
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
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);

  const ignored = Boolean(
    comment.author &&
      viewer &&
      viewer.ignoredUsers.some((u) => Boolean(u.id === comment.author!.id))
  );

  const handleInView = useCallback(
    (visible: boolean) => {
      onInView(visible, comment.id, comment.createdAt, cursor);
    },
    [comment.createdAt, comment.id, cursor, onInView]
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
      onReplyToParent(parent);
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
          <div className={styles.parent}>
            <Flex justifyContent="flex-start" alignItems="center">
              <ShortcutIcon
                width="36px"
                height="20px"
                className={styles.parentArrow}
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
                  <div className={styles.parentUser}>
                    {comment.parent.author?.username}:
                  </div>
                  <div className={styles.parentBody}>
                    {getHTMLPlainText(comment.parent?.body || "")}
                  </div>
                </Flex>
              </Button>
            </Flex>
          </div>
        )}

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
          username
        }
        body
        ...LiveConversationContainer_comment
      }
      actionCounts {
        reaction {
          total
        }
      }
      ...ReportFlowContainer_comment
      ...LiveCommentActionsContainer_comment
      ...LiveConversationContainer_comment
      ...LiveCommentBodyContainer_comment
      ...LiveEditCommentFormContainer_comment
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