import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import { Spinner } from "coral-ui/components";

import { UserHistoryRejectedCommentsContainerQuery as QueryTypes } from "coral-admin/__generated__/UserHistoryRejectedCommentsContainerQuery.graphql";
import { graphql, QueryRenderer } from "coral-framework/lib/relay";

import UserHistoryRejectedComments from "./UserHistoryRejectedComments";

import styles from "./UserHistoryRejectedCommentsContainer.css";

interface Props {
  userID: string;
}

const UserHistoryRejectedCommentsContainer: FunctionComponent<Props> = ({
  userID,
}) => {
  return (
    <QueryRenderer<any>
      query={graphql`
        query UserHistoryRejectedCommentsContainerQuery($userID: ID!) {
          user(id: $userID) {
            ...UserHistoryRejectedComments_user
          }
          viewer {
            ...UserHistoryRejectedComments_viewer
          }
          settings {
            ...UserHistoryRejectedComments_settings
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
          return <div>User not found</div>;
        }

        return (
          <UserHistoryRejectedComments
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

export default UserHistoryRejectedCommentsContainer;
