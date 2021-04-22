import React, { FunctionComponent, useCallback, useState } from "react";
import { commitLocalUpdate, graphql } from "react-relay";
import { ConnectionHandler } from "relay-runtime";

import { waitFor } from "coral-common/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  deleteConnection,
  QueryRenderer,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-ui/types";

import { LiveConversationQuery } from "coral-stream/__generated__/LiveConversationQuery.graphql";
import { LiveConversationQuery_comment } from "coral-stream/__generated__/LiveConversationQuery_comment.graphql";
import { LiveConversationQuery_settings } from "coral-stream/__generated__/LiveConversationQuery_settings.graphql";
import { LiveConversationQuery_story } from "coral-stream/__generated__/LiveConversationQuery_story.graphql";
import { LiveConversationQuery_viewer } from "coral-stream/__generated__/LiveConversationQuery_viewer.graphql";

import LiveCommentRepliesAfterContainer from "./LiveCommentRepliesAfterContainer";
import LiveCommentRepliesBeforeContainer from "./LiveCommentRepliesBeforeContainer";
import LiveConversationContainer from "./LiveConversationContainer";

interface Props {
  settings: LiveConversationQuery_settings;
  viewer: LiveConversationQuery_viewer | null;
  story: LiveConversationQuery_story;
  comment: LiveConversationQuery_comment;

  onClose: () => void;
}

const LiveConversationQuery: FunctionComponent<Props> = ({
  story,
  viewer,
  settings,
  comment,
  onClose,
}) => {
  const { relayEnvironment } = useCoralContext();
  const [cursor, setCursor] = useState(new Date(0).toISOString());

  // The pagination container wouldn't allow us to start a new connection
  // by refetching with a different cursor. So we delete the connection first,
  // before starting the refetch.
  const deleteConnectionsAndSetCursor = useCallback(
    async (s: string) => {
      // Setting empty cursor will trigger loading state and stops rendering the query.
      setCursor("");
      // Wait for the loading state to render.
      await waitFor(0);
      // Clear current connections, this will cause data to be stale and invalid,
      // no problems though, because we are in loading state and not rendering the
      // full tree.
      commitLocalUpdate(relayEnvironment, async (store) => {
        const commentRecord = store.get(comment.id)!;
        const chatAfter = ConnectionHandler.getConnection(
          commentRecord,
          "Replies_after"
        );
        const chatBefore = ConnectionHandler.getConnection(
          commentRecord,
          "Replies_before"
        );

        if (chatBefore) {
          deleteConnection(store, chatBefore.getDataID());
        }
        if (chatAfter) {
          deleteConnection(store, chatAfter.getDataID());
        }
      });
      // Now reload with a new cursor.
      setCursor(s);
    },
    [comment.id, relayEnvironment]
  );

  const initialProps: PropTypesOf<typeof LiveConversationContainer> = {
    story,
    settings,
    viewer,
    comment,
    commentDeferred: null,
    onClose,
    isLoading: true,
    error: "",
    setCursor: deleteConnectionsAndSetCursor,
    afterComments: [],
    afterHasMore: false,
    isLoadingMoreAfter: false,
    loadMoreAfter: () => Promise.resolve(),
    beforeComments: [],
    beforeHasMore: false,
    isLoadingMoreBefore: false,
    loadMoreBefore: () => Promise.resolve(),
    afterHasMoreFromMutation: false,
  };

  if (!cursor) {
    return <LiveConversationContainer {...initialProps} />;
  }

  return (
    <QueryRenderer<LiveConversationQuery>
      query={graphql`
        query LiveConversationQuery($commentID: ID!, $cursor: Cursor) {
          comment(id: $commentID) {
            ...LiveCommentRepliesBeforeContainer_comment
              @arguments(cursor: $cursor)
            ...LiveCommentRepliesAfterContainer_comment
              @arguments(cursor: $cursor)
            ...LiveConversationContainer_commentDeferred
          }
        }
      `}
      variables={{
        commentID: comment.id,
        cursor,
      }}
      render={(data) => {
        const isLoading = !data || !data.props || !data.props.comment;
        const props: PropTypesOf<typeof LiveConversationContainer> = {
          ...initialProps,
          commentDeferred: data.props?.comment || null,
          isLoading,
          error: data.error?.message || "",
        };
        if (isLoading || data.error) {
          return <LiveConversationContainer {...props} />;
        }
        return (
          <LiveCommentRepliesBeforeContainer
            comment={data.props!.comment!}
            viewer={viewer}
            cursor={cursor}
          >
            {({
              beforeComments,
              beforeHasMore,
              loadMoreBefore,
              isLoadingMoreBefore,
            }) => (
              <LiveCommentRepliesAfterContainer
                comment={data.props!.comment!}
                viewer={viewer}
                cursor={cursor}
              >
                {({
                  afterComments,
                  afterHasMore,
                  loadMoreAfter,
                  isLoadingMoreAfter,
                  afterHasMoreFromMutation,
                }) => (
                  <LiveConversationContainer
                    {...props}
                    beforeComments={beforeComments}
                    beforeHasMore={beforeHasMore}
                    loadMoreBefore={loadMoreBefore}
                    isLoadingMoreBefore={isLoadingMoreBefore}
                    afterComments={afterComments}
                    afterHasMore={afterHasMore}
                    loadMoreAfter={loadMoreAfter}
                    isLoadingMoreAfter={isLoadingMoreAfter}
                    afterHasMoreFromMutation={afterHasMoreFromMutation}
                  />
                )}
              </LiveCommentRepliesAfterContainer>
            )}
          </LiveCommentRepliesBeforeContainer>
        );
      }}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveConversationQuery_story on Story {
      ...LiveConversationContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveConversationQuery_viewer on User {
      ...LiveConversationContainer_viewer
      ...LiveCommentRepliesBeforeContainer_viewer
      ...LiveCommentRepliesAfterContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveConversationQuery_settings on Settings {
      ...LiveConversationContainer_settings
    }
  `,
  comment: graphql`
    fragment LiveConversationQuery_comment on Comment {
      id
      ...LiveConversationContainer_comment
    }
  `,
})(LiveConversationQuery);

export default enhanced;
