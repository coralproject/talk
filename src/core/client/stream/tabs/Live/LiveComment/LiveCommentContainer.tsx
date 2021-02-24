import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { graphql } from "react-relay";

import { useToggleState } from "coral-framework/hooks";
import { useInView } from "coral-framework/lib/intersection";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { ReactionButtonContainer } from "coral-stream/tabs/shared/ReactionButton";
import ReportFlowContainer, {
  ReportButton,
} from "coral-stream/tabs/shared/ReportFlow";
import { Divider } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";
import { LiveCommentContainer_settings } from "coral-stream/__generated__/LiveCommentContainer_settings.graphql";
import { LiveCommentContainer_viewer } from "coral-stream/__generated__/LiveCommentContainer_viewer.graphql";
import { LiveCommentReplyContainer_comment } from "coral-stream/__generated__/LiveCommentReplyContainer_comment.graphql";

import styles from "./LiveCommentContainer.css";

interface Props {
  viewer: LiveCommentContainer_viewer | null;
  comment: LiveCommentContainer_comment;
  settings: LiveCommentContainer_settings;
  onInView: (
    visible: boolean,
    id: string,
    createdAt: string,
    cursor: string
  ) => void;
  onReplyTo: (comment: LiveCommentReplyContainer_comment) => void;
}

const LiveCommentContainer: FunctionComponent<Props> = ({
  comment,
  viewer,
  settings,
  onInView,
  onReplyTo,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { inView, intersectionRef } = useInView();

  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);

  const isViewerBanned = false;
  const isViewerSuspended = false;
  const isViewerWarned = false;

  useEffect(() => {
    if (inView) {
      onInView(inView, comment.id, comment.createdAt, comment.createdAt);
    }
  }, [comment.createdAt, comment.id, inView, onInView]);

  const onReply = useCallback(() => {
    if (!comment || !comment.revision) {
      return;
    }

    onReplyTo(comment as any);
  }, [comment, onReplyTo]);

  return (
    <div ref={rootRef}>
      <div className={styles.comment} ref={intersectionRef}>
        {comment.parent && (
          <div>
            <div>{comment.parent.author?.username}</div>
            <div>{comment.parent.body}</div>
            <div>{comment.parent.createdAt}</div>
            <div>---</div>
          </div>
        )}

        <div>{comment.author?.username}</div>
        <div>{comment.body}</div>
        <div>{comment.createdAt}</div>

        <div id={`comment-${comment.id}`}>
          {viewer && (
            <ReactionButtonContainer
              reactedClassName=""
              comment={comment}
              settings={settings}
              viewer={viewer}
              readOnly={isViewerBanned || isViewerSuspended || isViewerWarned}
              isQA={false}
            />
          )}
          <ReportButton
            onClick={toggleShowReportFlow}
            open={showReportFlow}
            viewer={viewer}
            comment={comment}
          />
          {!comment.parent && <Button onClick={onReply}>Reply</Button>}
        </div>
        {showReportFlow && (
          <ReportFlowContainer
            viewer={viewer}
            comment={comment}
            settings={settings}
            onClose={toggleShowReportFlow}
          />
        )}

        <Divider />
      </div>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LiveCommentContainer_viewer on User {
      id
      ...ReportFlowContainer_viewer
      ...ReportButton_viewer
      ...ReactionButtonContainer_viewer
    }
  `,
  comment: graphql`
    fragment LiveCommentContainer_comment on Comment {
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
        author {
          id
          username
        }
        createdAt
        body
      }

      ...ReportButton_comment
      ...ReportFlowContainer_comment
      ...ReactionButtonContainer_comment
      ...LiveCommentReplyContainer_comment
    }
  `,
  settings: graphql`
    fragment LiveCommentContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...ReactionButtonContainer_settings
    }
  `,
})(LiveCommentContainer);

export default enhanced;
