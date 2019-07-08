import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import React, { FunctionComponent } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { Button } from "coral-ui/components/";

import { UserHistoryRejectedComments_settings } from "coral-admin/__generated__/UserHistoryRejectedComments_settings.graphql";
import { UserHistoryRejectedComments_user } from "coral-admin/__generated__/UserHistoryRejectedComments_user.graphql";
import { UserHistoryRejectedComments_viewer } from "coral-admin/__generated__/UserHistoryRejectedComments_viewer.graphql";
import { UserHistoryRejectedCommentsPaginationQueryVariables } from "coral-admin/__generated__/UserHistoryRejectedCommentsPaginationQuery.graphql";

import { ModerateCardContainer } from "../ModerateCard";

import styles from "./UserHistoryRejectedComments.css";

interface Props {
  user: UserHistoryRejectedComments_user;
  viewer: UserHistoryRejectedComments_viewer;
  settings: UserHistoryRejectedComments_settings;
  relay: RelayPaginationProp;
}

const UserHistoryRejectedComments: FunctionComponent<Props> = props => {
  const comments = props.user
    ? props.user.rejectedComments.edges.map(edge => edge.node)
    : [];

  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 5);

  const onLoadMore = () => {
    if (!loadMore || isLoadingMore) {
      return;
    }

    loadMore();
  };

  const hasMore = props.relay.hasMore();

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

type FragmentVariables = UserHistoryRejectedCommentsPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  UserHistoryRejectedCommentsPaginationQueryVariables,
  FragmentVariables
>(
  {
    viewer: graphql`
      fragment UserHistoryRejectedComments_viewer on User {
        ...ModerateCardContainer_viewer
      }
    `,
    settings: graphql`
      fragment UserHistoryRejectedComments_settings on Settings {
        ...ModerateCardContainer_settings
      }
    `,
    user: graphql`
      fragment UserHistoryRejectedComments_user on User
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
        ) {
        rejectedComments(first: $count, after: $cursor)
          @connection(key: "UserHistoryRejected_rejectedComments") {
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
      return props.user && props.user.rejectedComments;
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
      query UserHistoryRejectedCommentsPaginationQuery(
        $userID: ID!
        $count: Int!
        $cursor: Cursor
      ) {
        user(id: $userID) {
          ...UserHistoryRejectedComments_user
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(UserHistoryRejectedComments);

export default enhanced;
