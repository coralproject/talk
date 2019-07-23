import { graphql, QueryRenderer } from "coral-framework/lib/relay";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import { CallOut, Spinner } from "coral-ui/components";

import { UserHistoryDrawerAccountHistoryQuery as QueryTypes } from "coral-admin/__generated__/UserHistoryDrawerAccountHistoryQuery.graphql";

import UserHistoryDrawerAccountHistory from "./UserHistoryDrawerAccountHistory";

import styles from "./UserHistoryDrawerAccountHistoryQuery.css";

interface Props {
  userID: string;
}

const UserHistoryDrawerAccountHistoryQuery: FunctionComponent<Props> = ({
  userID,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserHistoryDrawerAccountHistoryQuery($userID: ID!) {
          user(id: $userID) {
            ...UserHistoryDrawerAccountHistory_user
          }
        }
      `}
      variables={{ userID }}
      cacheConfig={{ force: true }}
      render={({ error, props }: ReadyState<QueryTypes["response"]>) => {
        if (error) {
          return (
            <div className={styles.callout}>
              <CallOut>{error.message}</CallOut>
            </div>
          );
        }

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
          <div>
            <UserHistoryDrawerAccountHistory user={props.user} />
          </div>
        );
      }}
    />
  );
};

export default UserHistoryDrawerAccountHistoryQuery;
