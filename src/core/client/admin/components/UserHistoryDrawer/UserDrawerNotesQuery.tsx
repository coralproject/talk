import { graphql, QueryRenderer } from "coral-framework/lib/relay";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import { UserDrawerNotesQuery as QueryTypes } from "coral-admin/__generated__/UserDrawerNotesQuery.graphql";

import { CallOut, Spinner } from "coral-ui/components";

import UserDrawerAccountHistory from "./UserDrawerAccountHistory";
import UserDrawerNotesContainer from "./UserDrawerNotesContainer";

import styles from "./UserDrawerNotesQuery.css";

interface Props {
  userID: string;
}

const UserDrawerNotesQuery: FunctionComponent<Props> = ({ userID }) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserDrawerNotesQuery($userID: ID!) {
          user(id: $userID) {
            ...UserDrawerNotesContainer_user
          }
          viewer {
            ...UserDrawerNotesContainer_viewer
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

        return (
          <UserDrawerNotesContainer user={props.user} viewer={props.viewer} />
        );
      }}
    />
  );
};

export default UserDrawerNotesQuery;
