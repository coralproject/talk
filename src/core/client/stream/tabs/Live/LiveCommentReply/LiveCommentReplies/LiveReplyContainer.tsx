import React, { FunctionComponent, useRef } from "react";
import { graphql } from "react-relay";

import { useToggleState } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { ReportFlowContainer } from "coral-stream/tabs/shared/ReportFlow";

import { LiveReplyContainer_comment } from "coral-stream/__generated__/LiveReplyContainer_comment.graphql";
import { LiveReplyContainer_settings } from "coral-stream/__generated__/LiveReplyContainer_settings.graphql";
import { LiveReplyContainer_viewer } from "coral-stream/__generated__/LiveReplyContainer_viewer.graphql";

import LiveCommentActionsContainer from "../../LiveComment/LiveCommentActionsContainer";
import LiveCommentBody from "../../LiveComment/LiveCommentBody";

import styles from "./LiveReplyContainer.css";

interface Props {
  viewer: LiveReplyContainer_viewer | null;
  comment: LiveReplyContainer_comment;
  settings: LiveReplyContainer_settings;
  onInView?: (
    visible: boolean,
    id: string,
    createdAt: string,
    cursor: string
  ) => void;
  cursor?: string;
}

const LiveReplyContainer: FunctionComponent<Props> = ({
  comment,
  viewer,
  settings,
  onInView,
  cursor,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);

  const ignored = Boolean(
    comment.author &&
      viewer &&
      viewer.ignoredUsers.some((u) => Boolean(u.id === comment.author!.id))
  );

  if (ignored) {
    return null;
  }

  return (
    <div ref={rootRef} className={styles.root} id={`comment-${comment.id}-top`}>
      <div className={styles.comment}>
        <LiveCommentBody
          author={comment.author}
          createdAt={comment.createdAt}
          body={comment.body}
        />

        <div id={`comment-${comment.id}`}>
          <LiveCommentActionsContainer
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
      <div id={`comment-${comment.id}-bottom`}></div>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LiveReplyContainer_viewer on User {
      id
      ignoredUsers {
        id
      }
      ...ReportFlowContainer_viewer
      ...LiveCommentActionsContainer_viewer
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
    }
  `,
  settings: graphql`
    fragment LiveReplyContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...LiveCommentActionsContainer_settings
    }
  `,
})(LiveReplyContainer);

export default enhanced;
