import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { ModerateCardContainer } from "coral-admin/components/ModerateCard";
import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { Button, CallOut, Divider } from "coral-ui/components/v2";

import { UserHistoryDrawerAllComments_settings } from "coral-admin/__generated__/UserHistoryDrawerAllComments_settings.graphql";
import { UserHistoryDrawerAllComments_user } from "coral-admin/__generated__/UserHistoryDrawerAllComments_user.graphql";
import { UserHistoryDrawerAllCommentsPaginationQueryVariables } from "coral-admin/__generated__/UserHistoryDrawerAllCommentsPaginationQuery.graphql";

import styles from "./UserHistoryDrawerAllComments.css";

interface Props {
  user: UserHistoryDrawerAllComments_user;
  settings: UserHistoryDrawerAllComments_settings;
  relay: RelayPaginationProp;
}

const UserHistoryDrawerAllComments: FunctionComponent<Props> = ({
  user,
  settings,
  relay,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 5);

  const onLoadMore = useCallback(() => {
    if (!loadMore || isLoadingMore) {
      return;
    }

    loadMore();
  }, [loadMore]);

  const hasMore = relay.hasMore();
  const comments = user ? user.allComments.edges.map((edge) => edge.node) : [];

  if (comments.length === 0) {
    return (
      <CallOut fullWidth>
        <Localized
          id="moderate-user-drawer-all-no-comments"
          $username={user.username}
        >
          <div>{user.username} has not submitted any comments.</div>
        </Localized>
      </CallOut>
    );
  }

  return (
    <>
      {comments.map((c, index) => (
        <div key={c.id}>
          <ModerateCardContainer
            comment={c}
            settings={settings}
            danglingLogic={(status) => false}
            hideUsername
            showStoryInfo
            mini
          />
          {// Don't show horizontal rule after last comment
          index !== comments.length - 1 && <Divider />}
        </div>
      ))}
      {hasMore && (
        <div className={styles.footer}>
          <Button className={styles.loadMore} onClick={onLoadMore}>
            <Localized id="moderate-user-drawer-load-more">Load More</Localized>
          </Button>
        </div>
      )}
    </>
  );
};

type FragmentVariables = UserHistoryDrawerAllCommentsPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  UserHistoryDrawerAllCommentsPaginationQueryVariables,
  FragmentVariables
>(
  {
    settings: graphql`
      fragment UserHistoryDrawerAllComments_settings on Settings {
        ...ModerateCardContainer_settings
      }
    `,
    user: graphql`
      fragment UserHistoryDrawerAllComments_user on User
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
        ) {
        username
        allComments(first: $count, after: $cursor)
          @connection(key: "UserHistoryDrawer_allComments") {
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
      return props.user && props.user.allComments;
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
      query UserHistoryDrawerAllCommentsPaginationQuery(
        $userID: ID!
        $count: Int!
        $cursor: Cursor
      ) {
        user(id: $userID) {
          ...UserHistoryDrawerAllComments_user
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(UserHistoryDrawerAllComments);

export default enhanced;
