import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Button } from "coral-ui/components/v3";

import { LiveCommentReplyContainer_comment } from "coral-stream/__generated__/LiveCommentReplyContainer_comment.graphql";
import { LiveCommentReplyContainer_settings } from "coral-stream/__generated__/LiveCommentReplyContainer_settings.graphql";
import { LiveCommentReplyContainer_story } from "coral-stream/__generated__/LiveCommentReplyContainer_story.graphql";
import { LiveCommentReplyContainer_viewer } from "coral-stream/__generated__/LiveCommentReplyContainer_viewer.graphql";

import LiveCreateCommentReplyFormContainer from "./LiveCreateCommentReplyFormContainer";

interface Props {
  settings: LiveCommentReplyContainer_settings;
  viewer: LiveCommentReplyContainer_viewer;
  story: LiveCommentReplyContainer_story;
  comment: LiveCommentReplyContainer_comment;

  onClose: () => void;
}

const LiveCommentReplyContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
  story,
  comment,
  onClose,
}) => {
  const onSubmitted = useCallback(() => {}, []);

  if (!comment.revision) {
    return null;
  }

  return (
    <div>
      <Button onClick={onClose} color="error">
        X
      </Button>
      <div>Replying to:</div>
      <div>
        {comment.createdAt}
        {comment.body}
      </div>
      <LiveCreateCommentReplyFormContainer
        settings={settings}
        viewer={viewer}
        story={story}
        parentID={comment.id}
        parentRevisionID={comment.revision.id}
        onSubmitted={onSubmitted}
      />
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveCommentReplyContainer_story on Story {
      id
      url
      ...LiveCreateCommentReplyFormContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveCommentReplyContainer_viewer on User {
      ...LiveCommentContainer_viewer
      ...LiveCreateCommentReplyFormContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveCommentReplyContainer_settings on Settings {
      ...LiveCommentContainer_settings
      ...LiveCreateCommentReplyFormContainer_settings
    }
  `,
  comment: graphql`
    fragment LiveCommentReplyContainer_comment on Comment {
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
    }
  `,
})(LiveCommentReplyContainer);

export default enhanced;
