import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";
import { CallOut, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { UserDrawerAccountHistoryQuery as QueryTypes } from "coral-admin/__generated__/UserDrawerAccountHistoryQuery.graphql";

import UserDrawerAccountHistory from "./UserDrawerAccountHistory";

import styles from "./UserDrawerAccountHistoryQuery.css";

interface Props {
  userID: string;
}

const UserDrawerAccountHistoryQuery: FunctionComponent<Props> = ({
  userID,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserDrawerAccountHistoryQuery($userID: ID!) {
          user(id: $userID) {
            ...UserDrawerAccountHistory_user
          }
        }
      `}
      variables={{ userID }}
      cacheConfig={{ force: true }}
      render={({ error, props }: QueryRenderData<QueryTypes>) => {
        if (error) {
          return <QueryError error={error} />;
        }

        if (!props) {
          return (
            <div className={styles.spinner}>
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

        return <UserDrawerAccountHistory user={props.user} />;
      }}
    />
  );
};

export default UserDrawerAccountHistoryQuery;
