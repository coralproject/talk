import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { Button, CallOut, Typography } from "coral-ui/components/";

import { UserHistoryAllComments_settings } from "coral-admin/__generated__/UserHistoryAllComments_settings.graphql";
import { UserHistoryAllComments_user } from "coral-admin/__generated__/UserHistoryAllComments_user.graphql";
import { UserHistoryAllComments_viewer } from "coral-admin/__generated__/UserHistoryAllComments_viewer.graphql";
import { UserHistoryAllCommentsPaginationQueryVariables } from "coral-admin/__generated__/UserHistoryAllCommentsPaginationQuery.graphql";
import { ModerateCardContainer } from "coral-admin/routes/Moderate/ModerateCard";

import styles from "./UserHistoryAllComments.css";

interface Props {
  user: UserHistoryAllComments_user;
  viewer: UserHistoryAllComments_viewer;
  settings: UserHistoryAllComments_settings;
  relay: RelayPaginationProp;
}

const UserHistoryAllComments: FunctionComponent<Props> = ({
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
  const comments = user ? user.allComments.edges.map(edge => edge.node) : [];

  if (comments.length === 0) {
    return (
      <CallOut fullWidth>
        <Localized
          id="moderate-user-drawer-rejected-no-comments"
          $username={user.username}
        >
          <Typography variant="bodyCopy">
            {user.username} has not submitted any comments.
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
        allComments(first: $count, after: $cursor)
          @connection(key: "UserHistoryAll_allComments") {
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
