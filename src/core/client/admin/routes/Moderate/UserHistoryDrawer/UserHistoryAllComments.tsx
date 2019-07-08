import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import React, { FunctionComponent } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { Button } from "coral-ui/components/";

import { UserHistoryAllComments_settings } from "coral-admin/__generated__/UserHistoryAllComments_settings.graphql";
import { UserHistoryAllComments_user } from "coral-admin/__generated__/UserHistoryAllComments_user.graphql";
import { UserHistoryAllComments_viewer } from "coral-admin/__generated__/UserHistoryAllComments_viewer.graphql";
import { UserHistoryAllCommentsPaginationQueryVariables } from "coral-admin/__generated__/UserHistoryAllCommentsPaginationQuery.graphql";

import { ModerateCardContainer } from "../ModerateCard";

import styles from "./UserHistoryAllComments.css";

interface Props {
  user: UserHistoryAllComments_user;
  viewer: UserHistoryAllComments_viewer;
  settings: UserHistoryAllComments_settings;
  relay: RelayPaginationProp;
}

const UserHistoryAllComments: FunctionComponent<Props> = props => {
  const comments = props.user
    ? props.user.comments.edges.map(edge => edge.node)
    : [];

  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 5);

  const onLoadMore = () => {
    if (!loadMore || isLoadingMore) {
      return;
    }

    loadMore();
  };

  const hasMore = props.relay.hasMore();

  if (comments.length === 0) {
    return (
      <div className={styles.error}>{`${
        props.user.username
      } has not submitted any comments.`}</div>
    );
  }

  return (
    <>
      {comments.map(c => (
        <ModerateCardContainer
          key={c.id}
          comment={c}
          viewer={props.viewer}
          settings={props.settings}
          danglingLogic={status => false}
          showStoryInfo={false}
        />
      ))}
      {hasMore && (
        <div className={styles.footer}>
          <Button className={styles.loadMore} onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </>
  );
};

type FragmentVariables = UserHistoryAllCommentsPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  UserHistoryAllCommentsPaginationQueryVariables,
  FragmentVariables
>(
  {
    viewer: graphql`
      fragment UserHistoryAllComments_viewer on User {
        ...ModerateCardContainer_viewer
      }
    `,
    settings: graphql`
      fragment UserHistoryAllComments_settings on Settings {
        ...ModerateCardContainer_settings
      }
    `,
    user: graphql`
      fragment UserHistoryAllComments_user on User
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
        ) {
        username
        comments(first: $count, after: $cursor)
          @connection(key: "UserHistoryAll_comments") {
          edges {
            node {
              id
              ...ModerateCardContainer_comment
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.user && props.user.comments;
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
        userID: fragmentVariables.userID,
      };
    },
    query: graphql`
      query UserHistoryAllCommentsPaginationQuery(
        $userID: ID!
        $count: Int!
        $cursor: Cursor
      ) {
        user(id: $userID) {
          ...UserHistoryAllComments_user
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(UserHistoryAllComments);

export default enhanced;
