import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import { CallOut, Spinner } from "coral-ui/components";

import { UserHistoryDrawerAllCommentsQuery as QueryTypes } from "coral-admin/__generated__/UserHistoryDrawerAllCommentsQuery.graphql";
import { graphql, QueryRenderer } from "coral-framework/lib/relay";

import UserHistoryDrawerAllComments from "./UserHistoryDrawerAllComments";

import styles from "./UserHistoryDrawerAllCommentsQuery.css";

interface Props {
  userID: string;
}

const UserHistoryDrawerAllCommentsQuery: FunctionComponent<Props> = ({
  userID,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserHistoryDrawerAllCommentsQuery($userID: ID!) {
          user(id: $userID) {
            ...UserHistoryDrawerAllComments_user
          }
          viewer {
            ...UserHistoryDrawerAllComments_viewer
          }
          settings {
            ...UserHistoryDrawerAllComments_settings
          }
        }
      `}
      variables={{ userID }}
      cacheConfig={{ force: true }}
      render={({ error, props }: ReadyState<QueryTypes["response"]>) => {
        if (!props) {
          return (
            <div className={styles.root}>
              <Spinner />
            </div>
          );
        }

        if (!props.user) {
          return (
            <div className={styles.callout}>
              <CallOut>
                <Localized id="moderate-user-drawer-user-not-found ">
                  User not found.
                </Localized>
              </CallOut>
            </div>
          );
        }

        return (
          <UserHistoryDrawerAllComments
            // We can never get to this part of the UI without being logged in.
            viewer={props.viewer!}
            settings={props.settings!}
            user={props.user}
          />
        );
      }}
    />
  );
};

export default UserHistoryDrawerAllCommentsQuery;
