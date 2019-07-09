import { graphql, QueryRenderer } from "coral-framework/lib/relay";
import React, { FunctionComponent } from "react";
import { ReadyState } from "react-relay";

import HorizontalRule from "coral-admin/routes/Configure/HorizontalRule";
import { CopyButton } from "coral-framework/components";
import {
  Button,
  Card,
  Flex,
  Icon,
  Modal,
  Spinner,
  Typography,
} from "coral-ui/components";

import { UserHistoryDrawerContainerQuery as QueryTypes } from "coral-admin/__generated__/UserHistoryDrawerContainerQuery.graphql";

import UserHistoryTabs from "./UserHistoryTabs";

import styles from "./UserHistoryDrawerContainer.css";

interface UserHistoryDrawerContainerProps {
  open: boolean;
  onClose: () => void;
  userID?: string;
}

const UserHistoryDrawerContainer: FunctionComponent<
  UserHistoryDrawerContainerProps
> = ({ open, onClose, userID }) => {
  return (
    <Modal open={open} onClose={onClose}>
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.root}>
          {open && userID && (
            <QueryRenderer<QueryTypes>
              query={graphql`
                query UserHistoryDrawerContainerQuery($userID: ID!) {
                  user(id: $userID) {
                    id
                    username
                    email
                    createdAt
                  }
                }
              `}
              variables={{ userID }}
              cacheConfig={{ force: true }}
              render={({
                error,
                props,
              }: ReadyState<QueryTypes["response"]>) => {
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

                const user = props.user;

                return (
                  <div className={styles.user}>
                    <Button className={styles.close} onClick={onClose}>
                      <Icon size="md">close</Icon>
                    </Button>
                    <Flex className={styles.username}>
                      <span>{user.username}</span>
                    </Flex>
                    <div className={styles.userDetails}>
                      <Flex alignItems="center" className={styles.userDetail}>
                        <Icon size="sm" className={styles.icon}>
                          mail_outline
                        </Icon>
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
                        <Icon size="sm" className={styles.icon}>
                          date_range
                        </Icon>
                        <Typography variant="bodyCopy" container="span">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-us",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                      </Flex>
                      <Flex alignItems="center" className={styles.userDetail}>
                        <Icon size="sm" className={styles.icon}>
                          people_outline
                        </Icon>
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
                    <HorizontalRule className={styles.divider} />
                    <div className={styles.comments}>
                      <UserHistoryTabs userID={user.id} />
                    </div>
                  </div>
                );
              }}
            />
          )}
        </Card>
      )}
    </Modal>
  );
};

export default UserHistoryDrawerContainer;
