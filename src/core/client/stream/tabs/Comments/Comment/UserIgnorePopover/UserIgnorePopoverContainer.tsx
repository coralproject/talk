import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { UserIgnorePopoverContainer_user as UserData } from "coral-stream/__generated__/UserIgnorePopoverContainer_user.graphql";
import { Box, Button, Flex, Typography } from "coral-ui/components";

import IgnoreUserMutation from "./IgnoreUserMutation";

import { Localized } from "fluent-react/compat";
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
    ignoreUser({ userID: user.id });
    onDismiss();
  }, [user.id, ignoreUser]);
  return (
    <Box className={styles.root} p={3}>
      <Localized
        id="comments-userIgnorePopover-ignoreUser"
        $username={user.username}
      >
        <Typography variant="heading3" mb={2}>
          Ignore {user.username}?
        </Typography>
      </Localized>
      <Localized id="comments-userIgnorePopover-description">
        <Typography variant="detail" mb={3}>
          When you ignore a commenter, all comments they wrote on the site will
          be hidden from you. You can undo this later from My Profile.
        </Typography>
      </Localized>
      <Flex justifyContent="flex-end" itemGutter="half">
        <Localized id="comments-userIgnorePopover-cancel">
          <Button variant="outlined" size="small" onClick={onDismiss}>
            Cancel
          </Button>
        </Localized>
        <Localized id="comments-userIgnorePopover-ignore">
          <Button variant="filled" size="small" onClick={onIgnore}>
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
