import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { ModerateCardContainer } from "coral-admin/components/ModerateCard";
import {
  useLoadMore,
  useLocal,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { Button, CallOut, Divider } from "coral-ui/components/v2";
import { millisToDays } from "coral-ui/helpers";

import { UserHistoryDrawerAllComments_local } from "coral-admin/__generated__/UserHistoryDrawerAllComments_local.graphql";
import { UserHistoryDrawerAllComments_settings } from "coral-admin/__generated__/UserHistoryDrawerAllComments_settings.graphql";
import { UserHistoryDrawerAllComments_user } from "coral-admin/__generated__/UserHistoryDrawerAllComments_user.graphql";
import { UserHistoryDrawerAllComments_viewer } from "coral-admin/__generated__/UserHistoryDrawerAllComments_viewer.graphql";
import { UserHistoryDrawerAllCommentsPaginationQueryVariables } from "coral-admin/__generated__/UserHistoryDrawerAllCommentsPaginationQuery.graphql";

import styles from "./UserHistoryDrawerAllComments.css";

interface Props {
  user: UserHistoryDrawerAllComments_user;
  settings: UserHistoryDrawerAllComments_settings;
  viewer: UserHistoryDrawerAllComments_viewer;
  relay: RelayPaginationProp;
  setUserID?: (id: string) => void;
}

const UserHistoryDrawerAllComments: FunctionComponent<Props> = ({
  user,
  settings,
  viewer,
  relay,
  setUserID,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 5);

  const [{ autoArchivingEnabled, autoArchivingThreshold }] = useLocal<
    UserHistoryDrawerAllComments_local
  >(graphql`
    fragment UserHistoryDrawerAllComments_local on Local {
      autoArchivingEnabled
      autoArchivingThreshold
    }
  `);

  const onLoadMore = useCallback(() => {
    if (!loadMore || isLoadingMore) {
      return;
    }

    void loadMore();
  }, [loadMore]);

  const hasMore = relay.hasMore();
  const comments = user ? user.allComments.edges.map((edge) => edge.node) : [];

  if (comments.length === 0) {
    return (
      <CallOut fullWidth>
        <Localized
          id="moderate-user-drawer-all-no-comments"
          $username={user.username || user.email}
        >
          <div>
            {user.username || user.email} has not submitted any comments.
          </div>
        </Localized>
      </CallOut>
    );
  }

  const archivingThresholdDays = autoArchivingEnabled
    ? millisToDays(autoArchivingThreshold as number)
    : null;

  return (
    <>
      {autoArchivingEnabled && (
        <Localized
          id="moderate-user-drawer-allComments-archived"
          $days={archivingThresholdDays}
        >
          <i>
            All of this user’s comments from the previous{" "}
            {archivingThresholdDays}.
          </i>
        </Localized>
      )}
      {comments.map((c, index) => (
        <div key={c.id}>
          <ModerateCardContainer
            comment={c}
            settings={settings}
            viewer={viewer}
            danglingLogic={(status) => false}
            hideUsername
            showStoryInfo
            mini
            onUsernameClicked={setUserID}
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
    viewer: graphql`
      fragment UserHistoryDrawerAllComments_viewer on User {
        ...ModerateCardContainer_viewer
      }
    `,
    user: graphql`
      fragment UserHistoryDrawerAllComments_user on User
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 5 }
          cursor: { type: "Cursor" }
        ) {
        username
        email
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
    getConnectionFromProps(props) {
      return props.user && props.user.allComments;
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
