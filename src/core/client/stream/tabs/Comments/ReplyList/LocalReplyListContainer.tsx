import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { PropTypesOf } from "coral-framework/types";

import { LocalReplyListContainer_comment$key as LocalReplyListContainer_comment } from "coral-stream/__generated__/LocalReplyListContainer_comment.graphql";
import { LocalReplyListContainer_settings$key as LocalReplyListContainer_settings } from "coral-stream/__generated__/LocalReplyListContainer_settings.graphql";
import { LocalReplyListContainer_story$key as LocalReplyListContainer_story } from "coral-stream/__generated__/LocalReplyListContainer_story.graphql";
import { LocalReplyListContainer_viewer$key as LocalReplyListContainer_viewer } from "coral-stream/__generated__/LocalReplyListContainer_viewer.graphql";

import ReplyList from "./ReplyList";

interface Props {
  indentLevel?: number;
  viewer: LocalReplyListContainer_viewer | null;
  story: LocalReplyListContainer_story;
  comment: LocalReplyListContainer_comment;
  settings: LocalReplyListContainer_settings;
  allowIgnoredTombstoneReveal?: boolean;
}

/**
 * LocalReplyListContainer renders the replies from the endpoint
 * `localReplies` instead of `replies`. This is e.g. used for the
 * ultimate threading level to only display the newly created comments
 * from the current user.
 */

const LocalReplyListContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
  comment,
  story,
  indentLevel,
  allowIgnoredTombstoneReveal,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment LocalReplyListContainer_viewer on User {
        ...ReplyListCommentContainer_viewer
      }
    `,
    viewer
  );

  const storyData = useFragment(
    graphql`
      fragment LocalReplyListContainer_story on Story {
        ...ReplyListCommentContainer_story
      }
    `,
    story
  );

  const commentData = useFragment(
    graphql`
      fragment LocalReplyListContainer_comment on Comment {
        id
        localReplies {
          id
          ...ReplyListCommentContainer_comment
        }
      }
    `,
    comment
  );

  const settingsData = useFragment(
    graphql`
      fragment LocalReplyListContainer_settings on Settings {
        ...ReplyListCommentContainer_settings
      }
    `,
    settings
  );

  if (!commentData.localReplies) {
    return null;
  }
  return (
    <ReplyList
      viewer={viewerData}
      settings={settingsData}
      comment={commentData}
      comments={commentData.localReplies}
      story={storyData}
      indentLevel={indentLevel}
      disableReplies
      allowIgnoredTombstoneReveal={allowIgnoredTombstoneReveal}
    />
  );
};

export type LocalReplyListContainerProps = PropTypesOf<
  typeof LocalReplyListContainer
>;
export default LocalReplyListContainer;
