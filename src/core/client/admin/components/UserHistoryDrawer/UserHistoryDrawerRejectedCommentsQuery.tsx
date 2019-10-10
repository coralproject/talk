import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import { graphql, QueryRenderer } from "coral-framework/lib/relay";
import { CallOut, Spinner } from "coral-ui/components";

import { UserHistoryDrawerRejectedCommentsQuery as QueryTypes } from "coral-admin/__generated__/UserHistoryDrawerRejectedCommentsQuery.graphql";

import UserHistoryDrawerRejectedComments from "./UserHistoryDrawerRejectedComments";

import styles from "./UserHistoryDrawerRejectedCommentsQuery.css";

interface Props {
  userID: string;
}

const UserHistoryDrawerRejectedCommentsQuery: FunctionComponent<Props> = ({
  userID,
}) => {
  return (
    <QueryRenderer<any>
      query={graphql`
        query UserHistoryDrawerRejectedCommentsQuery($userID: ID!) {
          user(id: $userID) {
            ...UserHistoryDrawerRejectedComments_user
          }
          viewer {
            ...UserHistoryDrawerRejectedComments_viewer
          }
          settings {
            ...UserHistoryDrawerRejectedComments_settings
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
          <UserHistoryDrawerRejectedComments
            // We can never get to this part of the UI without being logged in.
            viewer={props.viewer!}
            settings={props.settings}
            user={props.user}
          />
        );
      }}
    />
  );
};

export default UserHistoryDrawerRejectedCommentsQuery;
