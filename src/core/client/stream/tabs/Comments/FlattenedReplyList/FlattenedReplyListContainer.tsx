import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withPaginationContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { FlattenedReplyListContainer_comment } from "coral-stream/__generated__/FlattenedReplyListContainer_comment.graphql";
import { FlattenedReplyListContainer_settings } from "coral-stream/__generated__/FlattenedReplyListContainer_settings.graphql";
import { FlattenedReplyListContainer_story } from "coral-stream/__generated__/FlattenedReplyListContainer_story.graphql";
import { FlattenedReplyListContainer_viewer } from "coral-stream/__generated__/FlattenedReplyListContainer_viewer.graphql";
import { FlattenedReplyListContainerPaginationQueryVariables } from "coral-stream/__generated__/FlattenedReplyListContainerPaginationQuery.graphql";

import { CommentContainer } from "../Comment";
import CollapsableComment from "../Comment/CollapsableComment";
import { isPublished } from "../helpers";

type FragmentVariables = Omit<
  FlattenedReplyListContainerPaginationQueryVariables,
  "commentID"
>;

interface Props {
  viewer: FlattenedReplyListContainer_viewer;
  story: FlattenedReplyListContainer_story;
  comment: FlattenedReplyListContainer_comment;
  settings: FlattenedReplyListContainer_settings;
}

const FlattenedReplyListContainer: FunctionComponent<Props> = ({
  viewer,
  story,
  comment,
  settings,
}) => {
  const comments =
    comment.lastViewerAction && !isPublished(comment.status)
      ? []
      : comment.replies.edges.map((edge) => edge.node);

  return (
    <>
      {comments.map((c) => (
        <HorizontalGutter key={c.id}>
          <CollapsableComment>
            {({ collapsed, toggleCollapsed }) => (
              <CommentContainer
                key={comment.id}
                ancestorID={comment.id}
                viewer={viewer}
                story={story}
                comment={c}
                settings={settings}
                indentLevel={4}
                collapsed={collapsed}
                toggleCollapsed={toggleCollapsed}
              />
            )}
          </CollapsableComment>
        </HorizontalGutter>
      ))}
    </>
  );
};

const enhanced = withPaginationContainer<
  Props,
  FlattenedReplyListContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    viewer: graphql`
      fragment FlattenedReplyListContainer_viewer on User {
        ...CommentContainer_viewer
      }
    `,
    story: graphql`
      fragment FlattenedReplyListContainer_story on Story {
        ...CommentContainer_story
      }
    `,
    comment: graphql`
      fragment FlattenedReplyListContainer_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 10 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        status
        pending
        lastViewerAction
        replies(
          first: $count
          after: $cursor
          orderBy: $orderBy
          flatten: true
        ) @connection(key: "FlattenedReplyListContainer_replies") {
          viewNewEdges {
            cursor
            node {
              id
              ...CommentContainer_comment
            }
          }
          edges {
            node {
              id
              ...CommentContainer_comment
            }
          }
        }
      }
    `,
    settings: graphql`
      fragment FlattenedReplyListContainer_settings on Settings {
        ...CommentContainer_settings
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.comment && props.comment.replies;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        orderBy: fragmentVariables.orderBy,
        commentID: props.comment.id,
      };
    },
    query: graphql`
      query FlattenedReplyListContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $orderBy: COMMENT_SORT!
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          ...FlattenedReplyListContainer_comment
            @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
        }
      }
    `,
  }
)(FlattenedReplyListContainer);

export default enhanced;
