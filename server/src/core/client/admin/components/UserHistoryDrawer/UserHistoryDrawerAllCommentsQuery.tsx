import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { CallOut, Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { UserHistoryDrawerAllCommentsQuery as QueryTypes } from "coral-admin/__generated__/UserHistoryDrawerAllCommentsQuery.graphql";

import UserHistoryDrawerAllComments from "./UserHistoryDrawerAllComments";

import styles from "./UserHistoryDrawerAllCommentsQuery.css";

interface Props {
  userID: string;
  setUserID?: (id: string) => void;
}

const UserHistoryDrawerAllCommentsQuery: FunctionComponent<Props> = ({
  userID,
  setUserID,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserHistoryDrawerAllCommentsQuery($userID: ID!) {
          user(id: $userID) {
            ...UserHistoryDrawerAllComments_user
          }
          settings {
            ...UserHistoryDrawerAllComments_settings
          }
          viewer {
            ...UserHistoryDrawerAllComments_viewer
          }
        }
      `}
      variables={{ userID }}
      cacheConfig={{ force: true }}
      render={({ error, props }) => {
        if (error) {
          return <QueryError error={error} />;
        }

        if (!props || !props.viewer) {
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
            settings={props.settings}
            viewer={props.viewer}
            user={props.user}
            setUserID={setUserID}
          />
        );
      }}
    />
  );
};

export default UserHistoryDrawerAllCommentsQuery;
