import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { CallOut, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { UserDrawerNotesQuery as QueryTypes } from "coral-admin/__generated__/UserDrawerNotesQuery.graphql";

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
      render={({ error, props }) => {
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

        return (
          <UserDrawerNotesContainer user={props.user} viewer={props.viewer} />
        );
      }}
    />
  );
};

export default UserDrawerNotesQuery;
