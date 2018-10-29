import React from "react";
import { graphql, GraphQLTaggedNode, RelayPaginationProp } from "react-relay";
import { withProps } from "recompose";

import { withPaginationContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";
import { ReplyListContainer1_comment as CommentData } from "talk-stream/__generated__/ReplyListContainer1_comment.graphql";
import { ReplyListContainer1_me as MeData } from "talk-stream/__generated__/ReplyListContainer1_me.graphql";
import { ReplyListContainer1_settings as SettingsData } from "talk-stream/__generated__/ReplyListContainer1_settings.graphql";
import { ReplyListContainer1_story as StoryData } from "talk-stream/__generated__/ReplyListContainer1_story.graphql";
import {
  COMMENT_SORT,
  ReplyListContainer1PaginationQueryVariables,
} from "talk-stream/__generated__/ReplyListContainer1PaginationQuery.graphql";
import { ReplyListContainer5_comment as Comment5Data } from "talk-stream/__generated__/ReplyListContainer5_comment.graphql";

import { StatelessComponent } from "enzyme";
import { FragmentKeys } from "talk-framework/lib/relay/types";
import ReplyList from "../components/ReplyList";
import LocalReplyListContainer from "./LocalReplyListContainer";

type UnpackArray<T> = T extends ReadonlyArray<infer U> ? U : any;
type ReplyNode5 = UnpackArray<Comment5Data["replies"]["edges"]>["node"];

export interface BaseProps {
  me: MeData | null;
  story: StoryData;
  comment: CommentData;
  settings: SettingsData;
  relay: RelayPaginationProp;
  indentLevel: number;
  localReply: boolean | undefined;
}

export type InnerProps = BaseProps & {
  ReplyListComponent:
    | React.ComponentType<{ [P in FragmentKeys<BaseProps>]: any }>
    | undefined;
};

// TODO: (cvle) This should be autogenerated.
interface FragmentVariables {
  count: number;
  cursor?: string;
  orderBy: COMMENT_SORT;
}
export class ReplyListContainer extends React.Component<InnerProps> {
  public state = {
    disableShowAll: false,
  };

  public render() {
    if (
      this.props.comment.replies == null ||
      this.props.comment.replies.edges.length === 0
    ) {
      return null;
    }
    const comments = this.props.comment.replies.edges.map(edge => ({
      ...edge.node,
      replyListElement: this.props.ReplyListComponent && (
        <this.props.ReplyListComponent
          me={this.props.me}
          comment={edge.node}
          story={this.props.story}
          settings={this.props.settings}
        />
      ),
      // ReplyListContainer5 contains replyCount.
      showConversationLink: ((edge.node as any) as ReplyNode5).replyCount > 0,
    }));
    return (
      <ReplyList
        me={this.props.me}
        comment={this.props.comment}
        comments={comments}
        story={this.props.story}
        settings={this.props.settings}
        onShowAll={this.showAll}
        hasMore={this.props.relay.hasMore()}
        disableShowAll={this.state.disableShowAll}
        indentLevel={this.props.indentLevel}
        localReply={this.props.localReply}
      />
    );
  }

  private showAll = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.setState({ disableShowAll: true });
    this.props.relay.loadMore(
      999999999, // Fetch All Replies
      error => {
        this.setState({ disableShowAll: false });
        if (error) {
          // tslint:disable-next-line:no-console
          console.error(error);
        }
      }
    );
  };
}

function createReplyListContainer(
  indentLevel: number,
  fragments: {
    me: GraphQLTaggedNode;
    story: GraphQLTaggedNode;
    comment: GraphQLTaggedNode;
    settings: GraphQLTaggedNode;
  },
  query: GraphQLTaggedNode,
  ReplyListComponent?: InnerProps["ReplyListComponent"],
  localReply?: boolean
) {
  return withProps({ indentLevel, ReplyListComponent, localReply })(
    withPaginationContainer<
      InnerProps,
      ReplyListContainer1PaginationQueryVariables,
      FragmentVariables
    >(fragments, {
      direction: "forward",
      getConnectionFromProps(props) {
        return props.comment && props.comment.replies;
      },
      // This is also the default implementation of `getFragmentVariables` if it isn't provided.
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
      query,
    })(ReplyListContainer)
  );
}

/**
 * LastReplyList uses the LocalReplyListContainer.
 */
const LastReplyList: StatelessComponent<
  PropTypesOf<typeof LocalReplyListContainer>
> = props => <LocalReplyListContainer {...props} indentLevel={6} />;

const ReplyListContainer5 = createReplyListContainer(
  5,
  {
    me: graphql`
      fragment ReplyListContainer5_me on User {
        ...CommentContainer_me
        ...LocalReplyListContainer_me
      }
    `,
    settings: graphql`
      fragment ReplyListContainer5_settings on Settings {
        ...LocalReplyListContainer_settings
        ...CommentContainer_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer5_story on Story {
        ...CommentContainer_story
        ...LocalReplyListContainer_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer5_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          edges {
            node {
              id
              replyCount
              ...CommentContainer_comment
              ...LocalReplyListContainer_comment
            }
          }
        }
      }
    `,
  },
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer5PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer5_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
  LastReplyList,
  true
);

const ReplyListContainer4 = createReplyListContainer(
  4,
  {
    me: graphql`
      fragment ReplyListContainer4_me on User {
        ...ReplyListContainer5_me
        ...CommentContainer_me
      }
    `,
    settings: graphql`
      fragment ReplyListContainer4_settings on Settings {
        ...ReplyListContainer5_settings
        ...CommentContainer_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer4_story on Story {
        ...ReplyListContainer5_story
        ...CommentContainer_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer4_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          edges {
            node {
              id
              ...CommentContainer_comment
              ...ReplyListContainer5_comment
            }
          }
        }
      }
    `,
  },
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer4PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer4_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
  ReplyListContainer5
);

const ReplyListContainer3 = createReplyListContainer(
  3,
  {
    me: graphql`
      fragment ReplyListContainer3_me on User {
        ...ReplyListContainer4_me
        ...CommentContainer_me
      }
    `,
    settings: graphql`
      fragment ReplyListContainer3_settings on Settings {
        ...ReplyListContainer4_settings
        ...CommentContainer_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer3_story on Story {
        ...ReplyListContainer4_story
        ...CommentContainer_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer3_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          edges {
            node {
              id
              ...CommentContainer_comment
              ...ReplyListContainer4_comment
            }
          }
        }
      }
    `,
  },
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer3PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer3_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
  ReplyListContainer4
);

const ReplyListContainer2 = createReplyListContainer(
  2,
  {
    me: graphql`
      fragment ReplyListContainer2_me on User {
        ...ReplyListContainer3_me
        ...CommentContainer_me
      }
    `,
    settings: graphql`
      fragment ReplyListContainer2_settings on Settings {
        ...ReplyListContainer3_settings
        ...CommentContainer_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer2_story on Story {
        ...ReplyListContainer3_story
        ...CommentContainer_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer2_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          edges {
            node {
              id
              ...CommentContainer_comment
              ...ReplyListContainer3_comment
            }
          }
        }
      }
    `,
  },
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer2PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer2_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
  ReplyListContainer3
);

const ReplyListContainer1 = createReplyListContainer(
  1,
  {
    me: graphql`
      fragment ReplyListContainer1_me on User {
        ...ReplyListContainer2_me
        ...CommentContainer_me
      }
    `,
    settings: graphql`
      fragment ReplyListContainer1_settings on Settings {
        ...ReplyListContainer2_settings
        ...CommentContainer_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer1_story on Story {
        ...ReplyListContainer2_story
        ...CommentContainer_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer1_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          edges {
            node {
              id
              ...CommentContainer_comment
              ...ReplyListContainer2_comment
            }
          }
        }
      }
    `,
  },
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer1PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer1_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
  ReplyListContainer2
);

export default ReplyListContainer1;
