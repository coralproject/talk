import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { UserBoxContainer } from "coral-stream/common/UserBox";

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
  setCursor: (cursor: string) => void;
}

const LiveStreamContainer: FunctionComponent<Props> = ({
  story,
  viewer,
  settings,
  cursor,
  setCursor,
}) => {
  return (
    <>
      <UserBoxContainer viewer={viewer} settings={settings} />
      <LiveCommentsBeforeContainer
        story={story}
        viewer={viewer}
        cursor={cursor}
      >
        {({
          beforeComments,
          beforeHasMore,
          loadMoreBefore,
          isLoadingMoreBefore,
        }) => (
          <LiveCommentsAfterContainer
            story={story}
            viewer={viewer}
            cursor={cursor}
          >
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
                cursor={cursor}
                setCursor={setCursor}
              />
            )}
          </LiveCommentsAfterContainer>
        )}
      </LiveCommentsBeforeContainer>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveStreamContainer_story on Story
      @argumentDefinitions(
        cursor: { type: "Cursor" }
        inclusiveAfter: { type: "Boolean!" }
        inclusiveBefore: { type: "Boolean!" }
      ) {
      ...LiveCommentsBeforeContainer_story
        @arguments(cursor: $cursor, inclusive: $inclusiveBefore)
      ...LiveCommentsAfterContainer_story
        @arguments(cursor: $cursor, inclusive: $inclusiveAfter)
      ...LiveChatContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveStreamContainer_viewer on User {
      ...LiveChatContainer_viewer
      ...UserBoxContainer_viewer
      ...LiveCommentsBeforeContainer_viewer
      ...LiveCommentsAfterContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveStreamContainer_settings on Settings {
      ...LiveChatContainer_settings
      ...UserBoxContainer_settings
    }
  `,
})(LiveStreamContainer);

export default enhanced;
