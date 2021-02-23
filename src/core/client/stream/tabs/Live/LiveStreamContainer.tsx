import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { LiveStreamContainer_settings } from "coral-stream/__generated__/LiveStreamContainer_settings.graphql";
import { LiveStreamContainer_story } from "coral-stream/__generated__/LiveStreamContainer_story.graphql";
import { LiveStreamContainer_viewer } from "coral-stream/__generated__/LiveStreamContainer_viewer.graphql";

import LiveChatContainer from "./LiveChatContainer";
import LiveCommentsAfterContainer from "./LiveCommentsAfterContainer";
import LiveCommentsBeforeContainer from "./LiveCommentsBeforeContainer";

interface Props {
  story: LiveStreamContainer_story;
  viewer: LiveStreamContainer_viewer | null;
  settings: LiveStreamContainer_settings;
  cursor: string;
  cursorSet?: boolean;
}

const LiveStreamContainer: FunctionComponent<Props> = ({
  story,
  viewer,
  settings,
  cursor,
  cursorSet,
}) => {
  return (
    <LiveCommentsBeforeContainer story={story} cursor={cursor}>
      {({
        beforeComments,
        beforeHasMore,
        loadMoreBefore,
        isLoadingMoreBefore,
      }) => (
        <LiveCommentsAfterContainer story={story} cursor={cursor}>
          {({
            afterComments,
            afterHasMore,
            loadMoreAfter,
            isLoadingMoreAfter,
          }) => (
            <LiveChatContainer
              beforeComments={beforeComments}
              beforeHasMore={beforeHasMore}
              loadMoreBefore={loadMoreBefore}
              isLoadingMoreBefore={isLoadingMoreBefore}
              afterComments={afterComments}
              afterHasMore={afterHasMore}
              loadMoreAfter={loadMoreAfter}
              isLoadingMoreAfter={isLoadingMoreAfter}
              viewer={viewer}
              settings={settings}
              story={story}
              cursorSet={cursorSet}
            />
          )}
        </LiveCommentsAfterContainer>
      )}
    </LiveCommentsBeforeContainer>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveStreamContainer_story on Story
      @argumentDefinitions(cursor: { type: "Cursor" }) {
      ...LiveCommentsBeforeContainer_story @arguments(cursor: $cursor)
      ...LiveCommentsAfterContainer_story @arguments(cursor: $cursor)
      ...LiveChatContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveStreamContainer_viewer on User {
      ...LiveChatContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveStreamContainer_settings on Settings {
      ...LiveChatContainer_settings
    }
  `,
})(LiveStreamContainer);

export default enhanced;
