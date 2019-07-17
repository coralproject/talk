import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { ModerateCardContainer } from "coral-admin/components/ModerateCard";
import { Button, CallOut, Typography } from "coral-ui/components";

import { UserHistoryDrawerRejectedComments_settings } from "coral-admin/__generated__/UserHistoryDrawerRejectedComments_settings.graphql";
import { UserHistoryDrawerRejectedComments_user } from "coral-admin/__generated__/UserHistoryDrawerRejectedComments_user.graphql";
import { UserHistoryDrawerRejectedComments_viewer } from "coral-admin/__generated__/UserHistoryDrawerRejectedComments_viewer.graphql";
import { UserHistoryDrawerRejectedCommentsPaginationQueryVariables } from "coral-admin/__generated__/UserHistoryDrawerRejectedCommentsPaginationQuery.graphql";

import styles from "./UserHistoryDrawerRejectedComments.css";

interface Props {
  user: UserHistoryDrawerRejectedComments_user;
  viewer: UserHistoryDrawerRejectedComments_viewer;
  settings: UserHistoryDrawerRejectedComments_settings;
  relay: RelayPaginationProp;
}

const UserHistoryDrawerRejectedComments: FunctionComponent<Props> = ({
  user,
  viewer,
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
  const comments = user
    ? user.rejectedComments.edges.map(edge => edge.node)
    : [];

  if (comments.length === 0) {
    return (
      <CallOut fullWidth>
        <Localized
          id="moderate-user-drawer-rejected-no-comments"
          $username={user.username}
        >
          <Typography variant="bodyCopy">
            {user.username} does not have any rejected comments.
          </Typography>
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
            viewer={viewer}
            settings={settings}
            danglingLogic={status => false}
            hideUsername
            showStoryInfo
            mini
          />
          {// Don't show horizontal rule after last comment
          index !== comments.length - 1 && <hr />}
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
    viewer: graphql`
      fragment UserHistoryDrawerRejectedComments_viewer on User {
        ...ModerateCardContainer_viewer
      }
    `,
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
