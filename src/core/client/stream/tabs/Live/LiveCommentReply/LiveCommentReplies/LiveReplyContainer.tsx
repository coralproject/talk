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

import InView from "../../InView";
import LiveCommentActionsContainer from "../../LiveComment/LiveCommentActionsContainer";
import LiveCommentBodyContainer from "../../LiveComment/LiveCommentBodyContainer";

import styles from "./LiveReplyContainer.css";

interface Props {
  story: LiveReplyContainer_story;
  viewer: LiveReplyContainer_viewer | null;
  comment: LiveReplyContainer_comment;
  settings: LiveReplyContainer_settings;
  onInView: (visible: boolean, commentID: string) => void;
}

const LiveReplyContainer: FunctionComponent<Props> = ({
  story,
  comment,
  viewer,
  settings,
  onInView,
}) => {
  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);

  const handleInView = useCallback(
    (visible: boolean) => {
      onInView(visible, comment.id);
    },
    [onInView, comment.id]
  );

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
    <div className={styles.root} id={`reply-${comment.id}-top`}>
      <div className={styles.comment}>
        <InView onInView={handleInView} />
        <LiveCommentBodyContainer
          comment={comment}
          settings={settings}
          viewer={viewer}
          story={story}
        />

        <div id={`reply-${comment.id}`}>
          <LiveCommentActionsContainer
            story={story}
            comment={comment}
            viewer={viewer}
            settings={settings}
            onToggleReport={toggleShowReportFlow}
          />
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
      ...LiveCommentBodyContainer_story
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
      ...LiveCommentBodyContainer_viewer
    }
  `,
  comment: graphql`
    fragment LiveReplyContainer_comment on Comment {
      id
      revision {
        id
      }
      author {
        id
        username
      }
      body
      createdAt
      parent {
        id
        parent {
          id
        }
        revision {
          id
        }
        author {
          id
          username
        }
        createdAt
        body
      }
      replyCount

      ...ReportFlowContainer_comment
      ...LiveCommentActionsContainer_comment
      ...LiveCommentConversationContainer_comment
      ...LiveCommentBodyContainer_comment
    }
  `,
  settings: graphql`
    fragment LiveReplyContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...LiveCommentActionsContainer_settings
      ...LiveCommentBodyContainer_settings
    }
  `,
})(LiveReplyContainer);

export default enhanced;
