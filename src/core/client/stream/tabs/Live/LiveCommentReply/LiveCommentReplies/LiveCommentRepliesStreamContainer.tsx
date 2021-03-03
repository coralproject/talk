import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { LiveCommentRepliesStreamContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesStreamContainer_comment.graphql";

import LiveCommentRepliesAfterContainer from "./LiveCommentRepliesAfterContainer";
import LiveCommentRepliesBeforeContainer from "./LiveCommentRepliesBeforeContainer";
import LiveCommentRepliesContainer from "./LiveCommentRepliesContainer";

interface Props {
  comment: LiveCommentRepliesStreamContainer_comment;
  storyID: string;
  cursor: string;
  jumpToReply: (cursor: string) => void;
}

const LiveCommentRepliesStreamContainer: FunctionComponent<Props> = ({
  comment,
  storyID,
  cursor,
  jumpToReply,
}) => {
  return (
    <LiveCommentRepliesBeforeContainer comment={comment} cursor={cursor}>
      {({
        beforeComments,
        beforeHasMore,
        loadMoreBefore,
        isLoadingMoreBefore,
      }) => (
        <LiveCommentRepliesAfterContainer comment={comment} cursor={cursor}>
          {({
            afterComments,
            afterHasMore,
            loadMoreAfter,
            isLoadingMoreAfter,
          }) => (
            <LiveCommentRepliesContainer
              beforeComments={beforeComments}
              beforeHasMore={beforeHasMore}
              loadMoreBefore={loadMoreBefore}
              isLoadingMoreBefore={isLoadingMoreBefore}
              afterComments={afterComments}
              afterHasMore={afterHasMore}
              loadMoreAfter={loadMoreAfter}
              isLoadingMoreAfter={isLoadingMoreAfter}
              comment={comment}
              storyID={storyID}
              setCursor={jumpToReply}
            />
          )}
        </LiveCommentRepliesAfterContainer>
      )}
    </LiveCommentRepliesBeforeContainer>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment LiveCommentRepliesStreamContainer_comment on Comment
      @argumentDefinitions(cursor: { type: "Cursor" }) {
      ...LiveCommentRepliesBeforeContainer_comment @arguments(cursor: $cursor)
      ...LiveCommentRepliesAfterContainer_comment @arguments(cursor: $cursor)
      ...LiveCommentRepliesContainer_comment
    }
  `,
})(LiveCommentRepliesStreamContainer);

export default enhanced;
