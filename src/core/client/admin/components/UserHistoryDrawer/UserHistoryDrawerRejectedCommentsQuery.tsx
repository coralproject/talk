import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { CallOut, Spinner } from "coral-ui/components/v2";

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
          settings {
            ...UserHistoryDrawerRejectedComments_settings
          }
        }
      `}
      variables={{ userID }}
      cacheConfig={{ force: true }}
      render={({ error, props }) => {
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
            settings={props.settings}
            user={props.user}
          />
        );
      }}
    />
  );
};

export default UserHistoryDrawerRejectedCommentsQuery;
