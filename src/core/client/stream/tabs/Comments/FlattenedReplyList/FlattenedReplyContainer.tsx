import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { FlattenedReplyContainer_comment } from "coral-stream/__generated__/FlattenedReplyContainer_comment.graphql";
import { FlattenedReplyContainer_settings } from "coral-stream/__generated__/FlattenedReplyContainer_settings.graphql";
import { FlattenedReplyContainer_story } from "coral-stream/__generated__/FlattenedReplyContainer_story.graphql";
import { FlattenedReplyContainer_viewer } from "coral-stream/__generated__/FlattenedReplyContainer_viewer.graphql";

interface Props {
  viewer: FlattenedReplyContainer_viewer;
  story: FlattenedReplyContainer_story;
  comment: FlattenedReplyContainer_comment;
  settings: FlattenedReplyContainer_settings;
}

const FlattenedReplyContainer: FunctionComponent<Props> = ({ comment }) => {
  return <div></div>;
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment FlattenedReplyContainer_viewer on User {
      id
      status {
        current
      }
      ignoredUsers {
        id
      }
      badges
      role
      scheduledDeletionDate
      mediaSettings {
        unfurlEmbeds
      }
      ...UsernameWithPopoverContainer_viewer
      ...ReactionButtonContainer_viewer
      ...ReportFlowContainer_viewer
      ...ReportButton_viewer
      ...CaretContainer_viewer
    }
  `,
  story: graphql`
    fragment FlattenedReplyContainer_story on Story {
      url
      isClosed
      canModerate
      settings {
        mode
      }
      ...CaretContainer_story
      ...ReplyCommentFormContainer_story
      ...PermalinkButtonContainer_story
      ...EditCommentFormContainer_story
      ...UserTagsContainer_story
    }
  `,
  comment: graphql`
    fragment FlattenedReplyContainer_comment on Comment {
      id
      body
    }
  `,
  settings: graphql`
    fragment FlattenedReplyContainer_settings on Settings {
      disableCommenting {
        enabled
      }
      featureFlags
    }
  `,
})(FlattenedReplyContainer);

export default enhanced;
