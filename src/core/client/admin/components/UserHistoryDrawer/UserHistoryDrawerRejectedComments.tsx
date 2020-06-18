import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { ModerateCardContainer } from "coral-admin/components/ModerateCard";
import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { Button, CallOut, Divider } from "coral-ui/components/v2";

import { UserHistoryDrawerRejectedComments_settings } from "coral-admin/__generated__/UserHistoryDrawerRejectedComments_settings.graphql";
import { UserHistoryDrawerRejectedComments_user } from "coral-admin/__generated__/UserHistoryDrawerRejectedComments_user.graphql";
import { UserHistoryDrawerRejectedCommentsPaginationQueryVariables } from "coral-admin/__generated__/UserHistoryDrawerRejectedCommentsPaginationQuery.graphql";

import styles from "./UserHistoryDrawerRejectedComments.css";

const danglingLogic = () => false;

interface Props {
  user: UserHistoryDrawerRejectedComments_user;
  settings: UserHistoryDrawerRejectedComments_settings;
  relay: RelayPaginationProp;
}

const UserHistoryDrawerRejectedComments: FunctionComponent<Props> = ({
  user,
  settings,
  relay,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 5);

  const onLoadMore = useCallback(() => {
    if (!loadMore || isLoadingMore) {
      return;
    }

    void loadMore();
  }, [loadMore]);

  const hasMore = relay.hasMore();
  const comments = user
    ? user.rejectedComments.edges.map((edge) => edge.node)
    : [];

  if (comments.length === 0) {
    return (
      <CallOut fullWidth>
        <Localized
          id="moderate-user-drawer-rejected-no-comments"
          $username={user.username}
        >
          <div>{user.username} does not have any rejected comments.</div>
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
            danglingLogic={danglingLogic}
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

type FragmentVariables = UserHistoryDrawerRejectedCommentsPaginationQueryVariables;

const enhanced = withPaginationContainer<
  Props,
  UserHistoryDrawerRejectedCommentsPaginationQueryVariables,
  FragmentVariables
>(
  {
    settings: graphql`
      fragment UserHistoryDrawerRejectedComments_settings on Settings {
        ...ModerateCardContainer_settings
      }
    `,
    user: graphql`
      fragment UserHistoryDrawerRejectedComments_user on User
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
        ) {
        username
        rejectedComments(first: $count, after: $cursor)
          @connection(key: "UserHistoryDrawer_rejectedComments") {
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
      query UserHistoryDrawerRejectedCommentsPaginationQuery(
        $userID: ID!
        $count: Int!
        $cursor: Cursor
      ) {
        user(id: $userID) {
          ...UserHistoryDrawerRejectedComments_user
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(UserHistoryDrawerRejectedComments);

export default enhanced;
