import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import React, { FunctionComponent } from "react";

import HorizontalRule from "coral-admin/routes/Configure/HorizontalRule";
import { CopyButton } from "coral-framework/components";
import {
  Button,
  Card,
  Flex,
  Icon,
  Modal,
  Typography,
} from "coral-ui/components";

import { UserHistoryDrawerContainer_user } from "coral-admin/__generated__/UserHistoryDrawerContainer_user.graphql";

import styles from "./UserHistoryDrawerContainer.css";

interface UserHistoryDrawerContainerProps {
  open: boolean;
  onClose: () => void;
  user: UserHistoryDrawerContainer_user;
}

const UserHistoryDrawerContainer: FunctionComponent<
  UserHistoryDrawerContainerProps
> = ({ open, onClose, user }) => {
  return (
    <Modal open={open} onClose={onClose}>
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.root}>
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
                {new Date(user.createdAt).toLocaleDateString("en-us", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
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
          <HorizontalRule />
        </Card>
      )}
    </Modal>
  );
};

const enhanced = withFragmentContainer<UserHistoryDrawerContainerProps>({
  user: graphql`
    fragment UserHistoryDrawerContainer_user on User {
      id
      username
      email
      createdAt
    }
  `,
})(UserHistoryDrawerContainer);

export default enhanced;
