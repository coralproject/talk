import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import { graphql, QueryRenderer } from "coral-framework/lib/relay";
import { CallOut, Spinner } from "coral-ui/components/v2";

import { UserHistoryDrawerQuery as QueryTypes } from "coral-admin/__generated__/UserHistoryDrawerQuery.graphql";

import UserHistoryDrawerContainer from "./UserHistoryDrawerContainer";

import styles from "./UserHistoryDrawerQuery.css";

interface Props {
  userID: string;
  onClose: () => void;
  firstFocusableRef: React.RefObject<any>;
  lastFocusableRef: React.RefObject<any>;
}

const UserHistoryDrawerQuery: FunctionComponent<Props> = ({
  userID,
  onClose,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query UserHistoryDrawerQuery($userID: ID!) {
          user(id: $userID) {
            ...UserHistoryDrawerContainer_user
          }
          settings {
            ...UserHistoryDrawerContainer_settings
          }
        }
      `}
      variables={{ userID }}
      cacheConfig={{ force: true }}
      render={({ props }: ReadyState<QueryTypes["response"]>) => {
        if (!props) {
          return (
            <div className={styles.root}>
              <Spinner />
            </div>
          );
        }

        if (!props.user) {
          return (
            <div className={styles.root}>
              <CallOut>
                <Localized id="moderate-user-drawer-user-not-found">
                  User not found.
                </Localized>
              </CallOut>
            </div>
          );
        }

        return (
          <UserHistoryDrawerContainer
            onClose={onClose}
            user={props.user}
            settings={props.settings}
          />
        );
      }}
    />
  );
};

export default UserHistoryDrawerQuery;
