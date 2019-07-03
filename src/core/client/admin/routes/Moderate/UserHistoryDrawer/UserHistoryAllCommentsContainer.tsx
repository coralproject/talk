import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import { UserHistoryAllCommentsContainerQuery as QueryTypes } from "coral-admin/__generated__/UserHistoryAllCommentsContainerQuery.graphql";
import { graphql, QueryRenderer } from "coral-framework/lib/relay";

import UserHistoryAllComments from "./UserHistoryAllComments";

interface Props {
  userID: string;
}

const UserHistoryAllCommentsContainer: FunctionComponent<Props> = ({
  userID,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserHistoryAllCommentsContainerQuery($userID: ID!) {
          user(id: $userID) {
            ...UserHistoryAllComments_user
          }
          viewer {
            ...UserHistoryAllComments_viewer
          }
          settings {
            ...UserHistoryAllComments_settings
          }
        }
      `}
      variables={{ userID }}
      cacheConfig={{ force: true }}
      render={({ error, props }: ReadyState<QueryTypes["response"]>) => {
        if (!props) {
          return <div>Loading...</div>;
        }

        if (!props.user) {
          return <div>User not found</div>;
        }

        return (
          <UserHistoryAllComments
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

export default UserHistoryAllCommentsContainer;
