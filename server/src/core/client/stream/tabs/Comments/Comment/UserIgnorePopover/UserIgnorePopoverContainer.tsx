import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Box, Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { UserIgnorePopoverContainer_user as UserData } from "coral-stream/__generated__/UserIgnorePopoverContainer_user.graphql";

import IgnoreUserMutation from "./IgnoreUserMutation";

import styles from "./UserIgnorePopoverContainer.css";

interface Props {
  onDismiss: () => void;
  user: UserData;
}

export const UserIgnorePopoverContainer: FunctionComponent<Props> = ({
  user,
  onDismiss,
}) => {
  const ignoreUser = useMutation(IgnoreUserMutation);
  const onIgnore = useCallback(() => {
    void ignoreUser({ userID: user.id });
    onDismiss();
  }, [user.id, ignoreUser]);
  return (
    <Box p={3} className={cn(styles.root, CLASSES.ignoreUserPopover.$root)}>
      <Localized
        id="comments-userIgnorePopover-ignoreUser"
        vars={{ username: user.username }}
      >
        <div className={styles.title}>Ignore {user.username}?</div>
      </Localized>
      <Localized id="comments-userIgnorePopover-description">
        <div className={styles.description}>
          When you ignore a commenter, all comments they wrote on the site will
          be hidden from you. You can undo this later from My Profile.
        </div>
      </Localized>
      <Flex justifyContent="flex-end" itemGutter="half">
        <Localized id="comments-userIgnorePopover-cancel">
          <Button
            className={CLASSES.ignoreUserPopover.cancelButton}
            variant="outlined"
            fontSize="extraSmall"
            paddingSize="extraSmall"
            onClick={onDismiss}
            color="secondary"
            upperCase
          >
            Cancel
          </Button>
        </Localized>
        <Localized id="comments-userIgnorePopover-ignore">
          <Button
            className={CLASSES.ignoreUserPopover.ignoreButton}
            variant="filled"
            fontSize="extraSmall"
            paddingSize="extraSmall"
            onClick={onIgnore}
            color="primary"
            upperCase
          >
            Ignore
          </Button>
        </Localized>
      </Flex>
    </Box>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment UserIgnorePopoverContainer_user on User {
      id
      username
    }
  `,
})(UserIgnorePopoverContainer);

export default enhanced;
