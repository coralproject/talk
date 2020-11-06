import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import FlattenedReplyListContainer from "coral-stream/tabs/Comments/FlattenedReplyList";
import LocalReplyListContainer from "coral-stream/tabs/Comments/ReplyList/LocalReplyListContainer";

import { LastReplyListContainer_comment } from "coral-stream/__generated__/LastReplyListContainer_comment.graphql";
import { LastReplyListContainer_settings } from "coral-stream/__generated__/LastReplyListContainer_settings.graphql";
import { LastReplyListContainer_story } from "coral-stream/__generated__/LastReplyListContainer_story.graphql";
import { LastReplyListContainer_viewer } from "coral-stream/__generated__/LastReplyListContainer_viewer.graphql";

interface Props {
  viewer: LastReplyListContainer_viewer;
  story: LastReplyListContainer_story;
  comment: LastReplyListContainer_comment;
  settings: LastReplyListContainer_settings;
}

const LastReplyListContainer: FunctionComponent<Props> = ({
  viewer,
  story,
  comment,
  settings,
}) => {
  // Do this or pull in through settings?
  // const [
  //   {
  //     flattenLastReply
  //   },
  // ] = useLocal<LastReplyListContainerLocal>(graphql`
  //   fragment LastReplyListContainerLocal on Local {
  //     flattenLastReply
  //   }
  // `);

  const flattenLastReply = true;

  if (flattenLastReply) {
    return (
      <FlattenedReplyListContainer
        viewer={viewer}
        story={story}
        comment={comment}
        settings={settings}
      />
    );
  } else {
    return (
      <LocalReplyListContainer
        indentLevel={4}
        singleConversationView={false}
        viewer={viewer}
        story={story}
        comment={comment}
        settings={settings}
      />
    );
  }
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LastReplyListContainer_viewer on User {
      ...LocalReplyListContainer_viewer @skip(if: $flattenLastReply)
      ...FlattenedReplyListContainer_viewer @include(if: $flattenLastReply)
    }
  `,
  story: graphql`
    fragment LastReplyListContainer_story on Story {
      ...LocalReplyListContainer_story @skip(if: $flattenLastReply)
      ...FlattenedReplyListContainer_story @include(if: $flattenLastReply)
    }
  `,
  comment: graphql`
    fragment LastReplyListContainer_comment on Comment {
      ...LocalReplyListContainer_comment @skip(if: $flattenLastReply)
      ...FlattenedReplyListContainer_comment @include(if: $flattenLastReply)
    }
  `,
  settings: graphql`
    fragment LastReplyListContainer_settings on Settings {
      featureFlags
      ...LocalReplyListContainer_settings @skip(if: $flattenLastReply)
      ...FlattenedReplyListContainer_settings @include(if: $flattenLastReply)
    }
  `,
})(LastReplyListContainer);

export default enhanced;
