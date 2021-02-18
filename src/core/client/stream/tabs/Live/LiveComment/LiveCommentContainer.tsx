import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useToggleState } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { ReactionButtonContainer } from "coral-stream/tabs/shared/ReactionButton";
import ReportFlowContainer, {
  ReportButton,
} from "coral-stream/tabs/shared/ReportFlow";
import { Divider } from "coral-ui/components/v2";

import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";
import { LiveCommentContainer_settings } from "coral-stream/__generated__/LiveCommentContainer_settings.graphql";
import { LiveCommentContainer_viewer } from "coral-stream/__generated__/LiveCommentContainer_viewer.graphql";

import styles from "./LiveCommentContainer.css";

interface Props {
  viewer: LiveCommentContainer_viewer | null;
  comment: LiveCommentContainer_comment;
  settings: LiveCommentContainer_settings;
}

const LiveCommentContainer: FunctionComponent<Props> = ({
  comment,
  viewer,
  settings,
}) => {
  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);

  const isViewerBanned = false;
  const isViewerSuspended = false;
  const isViewerWarned = false;

  return (
    <div className={styles.comment}>
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
