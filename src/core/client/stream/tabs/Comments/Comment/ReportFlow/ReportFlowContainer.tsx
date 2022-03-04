import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { ReportFlowContainer_comment$key as ReportFlowContainer_comment } from "coral-stream/__generated__/ReportFlowContainer_comment.graphql";
import { ReportFlowContainer_settings$key as ReportFlowContainer_settings } from "coral-stream/__generated__/ReportFlowContainer_settings.graphql";
import { ReportFlowContainer_viewer$key as ReportFlowContainer_viewer } from "coral-stream/__generated__/ReportFlowContainer_viewer.graphql";

import ReportCommentFormContainer from "./ReportCommentFormContainer";

interface Props {
  viewer: ReportFlowContainer_viewer | null;
  comment: ReportFlowContainer_comment;
  settings: ReportFlowContainer_settings;
  onClose: () => void;
}

const ReportFlowContainer: FunctionComponent<Props> = ({
  viewer,
  comment,
  onClose,
  settings,
}) => {
  const settingsData = useFragment(
    graphql`
      fragment ReportFlowContainer_settings on Settings {
        ...ReportCommentFormContainer_settings
      }
    `,
    settings
  );
  const viewerData = useFragment(
    graphql`
      fragment ReportFlowContainer_viewer on User {
        id
      }
    `,
    viewer
  );
  const commentData = useFragment(
    graphql`
      fragment ReportFlowContainer_comment on Comment {
        ...ReportCommentFormContainer_comment
        id
        viewerActionPresence {
          dontAgree
          flag
        }
      }
    `,
    comment
  );

  const onFormClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!viewerData) {
    return null;
  }

  return (
    <ReportCommentFormContainer
      comment={commentData}
      onClose={onFormClose}
      settings={settingsData}
    />
  );
};

export default ReportFlowContainer;
