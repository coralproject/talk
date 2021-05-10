import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useToggleState } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { ReportFlowContainer } from "coral-stream/tabs/shared/ReportFlow";
import { Tombstone } from "coral-ui/components/v3";

import { LiveReplyContainer_comment } from "coral-stream/__generated__/LiveReplyContainer_comment.graphql";
import { LiveReplyContainer_settings } from "coral-stream/__generated__/LiveReplyContainer_settings.graphql";
import { LiveReplyContainer_story } from "coral-stream/__generated__/LiveReplyContainer_story.graphql";
import { LiveReplyContainer_viewer } from "coral-stream/__generated__/LiveReplyContainer_viewer.graphql";

import InView from "../InView";
import LiveCommentActionsContainer from "../LiveComment/LiveCommentActionsContainer";
import LiveCommentAvatarAndBodyContainer from "../LiveComment/LiveCommentAvatarAndBodyContainer";

import styles from "./LiveReplyContainer.css";

interface Props {
  story: LiveReplyContainer_story;
  viewer: LiveReplyContainer_viewer | null;
  comment: LiveReplyContainer_comment;
  settings: LiveReplyContainer_settings;
  onInView: (visible: boolean, commentID: string) => void;

  onEdit?: (comment: LiveReplyContainer_comment) => void;
  editing?: boolean;
  onCancelEditing?: () => void;

  truncateBody?: boolean;
  highlight?: boolean;

  scrollParentToID: (id: string) => void;
}

const LiveReplyContainer: FunctionComponent<Props> = ({
  story,
  comment,
  viewer,
  settings,
  onInView,
  onEdit,
  editing,
  onCancelEditing,
  truncateBody,
  highlight,
  scrollParentToID,
}) => {
  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);
  const scrollToReportDialog = useCallback(() => {
    const id = `comments-reportPopover-reportThisComment-${comment.id}`;
    scrollParentToID(id);
  }, [scrollParentToID, comment.id]);
  const toggleAndScrollReportFlow = useCallback(() => {
    if (!showReportFlow) {
      toggleShowReportFlow();
      setTimeout(scrollToReportDialog, 300);
    } else {
      toggleShowReportFlow();
    }
  }, [scrollToReportDialog, showReportFlow, toggleShowReportFlow]);

  const handleInView = useCallback(
    (visible: boolean) => {
      onInView(visible, comment.id);
    },
    [onInView, comment.id]
  );

  const handleOnEdit = useCallback(() => {
    if (!onEdit) {
      return;
    }

    onEdit(comment);
  }, [onEdit, comment]);

  const computeOnEdit = useCallback(() => {
    if (!onEdit) {
      return undefined;
    }
    if (editing) {
      return undefined;
    }

    return handleOnEdit;
  }, [editing, handleOnEdit, onEdit]);

  const ignored = Boolean(
    comment.author &&
      viewer &&
      viewer.ignoredUsers.some((u) => Boolean(u.id === comment.author!.id))
  );

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
      className={cn(
        styles.root,
        {
          [styles.highlight]: highlight,
          [styles.editHighlight]: editing,
        },
        CLASSES.comment.$root,
        `${CLASSES.comment.reacted}-${comment.actionCounts.reaction.total}`
      )}
      id={`reply-${comment.id}-top`}
    >
      <div className={styles.comment}>
        <InView onInView={handleInView} />
        <LiveCommentAvatarAndBodyContainer
          comment={comment}
          settings={settings}
          viewer={viewer}
          story={story}
          containerClassName={cn({
            [styles.highlight]: highlight,
            [styles.editHighlight]: editing,
          })}
          onCancel={editing ? onCancelEditing : undefined}
          truncateBody={truncateBody}
        />

        <div id={`reply-${comment.id}`}>
          {!editing && (
            <LiveCommentActionsContainer
              story={story}
              comment={comment}
              viewer={viewer}
              settings={settings}
              onToggleReport={toggleAndScrollReportFlow}
              onEdit={computeOnEdit()}
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
      <div id={`reply-${comment.id}-bottom`}></div>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveReplyContainer_story on Story {
      ...LiveCommentActionsContainer_story
      ...LiveCommentAvatarAndBodyContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveReplyContainer_viewer on User {
      id
      ignoredUsers {
        id
      }
      ...ReportFlowContainer_viewer
      ...LiveCommentActionsContainer_viewer
      ...LiveCommentAvatarAndBodyContainer_viewer
    }
  `,
  comment: graphql`
    fragment LiveReplyContainer_comment on Comment {
      id
      author {
        id
        username
      }
      actionCounts {
        reaction {
          total
        }
      }

      ...ReportFlowContainer_comment
      ...LiveCommentActionsContainer_comment
      ...LiveConversationContainer_comment
      ...LiveCommentAvatarAndBodyContainer_comment
      ...LiveEditCommentFormContainer_comment
    }
  `,
  settings: graphql`
    fragment LiveReplyContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...LiveCommentActionsContainer_settings
      ...LiveCommentAvatarAndBodyContainer_settings
    }
  `,
})(LiveReplyContainer);

export default enhanced;
