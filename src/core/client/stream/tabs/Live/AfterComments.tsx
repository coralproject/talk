import React, { FunctionComponent, useEffect } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { useEffectAfterMount } from "coral-framework/hooks";
import {
  useSubscription,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";

import { AfterCommentsContainer_settings } from "coral-stream/__generated__/AfterCommentsContainer_settings.graphql";
import { AfterCommentsContainer_story } from "coral-stream/__generated__/AfterCommentsContainer_story.graphql";
import { AfterCommentsContainer_viewer } from "coral-stream/__generated__/AfterCommentsContainer_viewer.graphql";
import { AfterCommentsContainerPaginationQueryVariables } from "coral-stream/__generated__/AfterCommentsContainerPaginationQuery.graphql";

import LiveCommentContainer from "./LiveComment";
import LiveCommentEnteredSubscription from "./LiveCommentEnteredSubscription";

interface Props {
  viewer: AfterCommentsContainer_viewer | null;
  settings: AfterCommentsContainer_settings;
  story: AfterCommentsContainer_story;
  relay: RelayPaginationProp;
  cursor: string;
  onCommentsChanged: () => void;
}

const AfterComments: FunctionComponent<Props> = ({
  viewer,
  settings,
  story,
  onCommentsChanged,
}) => {
  const after = story.after;
  const afterComments = after?.edges.map((e: { node: any }) => e.node) || [];

  const subscribeToCommentEntered = useSubscription(
    LiveCommentEnteredSubscription
  );

  useEffect(() => {
    const disposable = subscribeToCommentEntered({
      storyID: story.id,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_ASC,
      storyConnectionKey: "Chat_after",
    });

    return () => {
      disposable.dispose();
    };
  }, [story.id, subscribeToCommentEntered]);

  useEffectAfterMount(() => {
    onCommentsChanged();
  }, [story.after, onCommentsChanged]);

  return (
    <>
      {afterComments.map((c: any) => {
        return (
          <div key={c.id}>
            <LiveCommentContainer
              comment={c}
              viewer={viewer}
              settings={settings}
            />
          </div>
        );
      })}
    </>
  );
};

type FragmentVariables = Omit<
  AfterCommentsContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  AfterCommentsContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    story: graphql`
      fragment AfterCommentsContainer_story on Story
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 5 }
          cursor: { type: "Cursor" }
        ) {
        id
        after: comments(
          flatten: true
          after: $cursor
          orderBy: CREATED_AT_ASC
          first: $count
        ) @connection(key: "Chat_after", filters: ["orderBy"]) {
          edges {
            cursor
            node {
              id
              ...LiveCommentContainer_comment
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
    viewer: graphql`
      fragment AfterCommentsContainer_viewer on User {
        ...LiveCommentContainer_viewer
      }
    `,
    settings: graphql`
      fragment AfterCommentsContainer_settings on Settings {
        ...LiveCommentContainer_settings
      }
    `,
  },
  {
    getConnectionFromProps({ story }) {
      return story && story.after;
    },
    getVariables(
      { story, cursor },
      { count, cursor: paginationCursor = cursor },
      fragmentVariables
    ) {
      return {
        count,
        cursor: paginationCursor,
        includeBefore: true,
        includeAfter: true,
        storyID: story.id,
        flattenReplies: true,
      };
    },
    query: graphql`
      query AfterCommentsContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $storyID: ID
      ) {
        story(id: $storyID) {
          ...AfterCommentsContainer_story
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(AfterComments);

export type LiveStreamProps = PropTypesOf<typeof enhanced>;
export default enhanced;
