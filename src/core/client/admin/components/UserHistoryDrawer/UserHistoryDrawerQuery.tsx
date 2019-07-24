import { graphql, QueryRenderer } from "coral-framework/lib/relay";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import { UserStatusChangeContainer } from "coral-admin/components/UserStatus";
import { CopyButton } from "coral-framework/components";
import {
  Button,
  CallOut,
  Flex,
  Icon,
  Spinner,
  Typography,
} from "coral-ui/components";

import { UserHistoryDrawerQuery as QueryTypes } from "coral-admin/__generated__/UserHistoryDrawerQuery.graphql";

import UserHistoryTabs from "./UserHistoryTabs";

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
            id
            username
            email
            createdAt
            ...UserStatusChangeContainer_user
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

        const user = props.user;

        return (
          <>
            <Button className={styles.close} onClick={onClose}>
              <Icon size="md">close</Icon>
            </Button>
            <Flex className={styles.username}>
              <span>{user.username}</span>
            </Flex>
            <div className={styles.userStatus}>
              <Flex alignItems="center">
                <div className={styles.userStatusLabel}>
                  <Typography variant="bodyCopyBold" container="div">
                    <Flex alignItems="center" itemGutter="half">
                      <Localized id="moderate-user-drawer-status-label">
                        Status:
                      </Localized>
                    </Flex>
                  </Typography>
                </div>
                <div className={styles.userStatusChange}>
                  <UserStatusChangeContainer user={user} fullWidth={false} />
                </div>
              </Flex>
            </div>
            <div className={styles.userDetails}>
              <Flex alignItems="center" className={styles.userDetail}>
                <Localized
                  id="moderate-user-drawer-email"
                  attrs={{ title: true }}
                >
                  <Icon size="sm" className={styles.icon}>
                    mail_outline
                  </Icon>
                </Localized>
                <Typography
                  variant="bodyCopy"
                  container="span"
                  className={styles.userDetailValue}
                >
                  {user.email}
                </Typography>
                <CopyButton
                  text={user.email!}
                  variant="regular"
                  className={styles.copy}
                />
              </Flex>
              <Flex alignItems="center" className={styles.userDetail}>
                <Localized
                  id="moderate-user-drawer-created-at"
                  attrs={{ title: true }}
                >
                  <Icon size="sm" className={styles.icon}>
                    date_range
                  </Icon>
                </Localized>
                <Typography variant="bodyCopy" container="span">
                  {new Date(user.createdAt).toLocaleDateString("en-us", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>
              </Flex>
              <Flex alignItems="center" className={styles.userDetail}>
                <Localized
                  id="moderate-user-drawer-member-id"
                  attrs={{ title: true }}
                >
                  <Icon size="sm" className={styles.icon}>
                    people_outline
                  </Icon>
                </Localized>
                <Typography
                  variant="bodyCopy"
                  container="span"
                  className={styles.userDetailValue}
                >
                  {user.id}
                </Typography>
                <CopyButton
                  text={user.id}
                  variant="regular"
                  className={styles.copy}
                />
              </Flex>
            </div>
            <hr className={styles.divider} />
            <div className={styles.comments}>
              <UserHistoryTabs userID={user.id} />
            </div>
          </>
        );
      }}
    />
  );
};

export default UserHistoryDrawerQuery;
