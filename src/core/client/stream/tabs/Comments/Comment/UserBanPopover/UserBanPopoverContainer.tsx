import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { UserBanPopoverContainer_user as UserData } from "coral-stream/__generated__/UserBanPopoverContainer_user.graphql";
import { Box, Button, Flex, Typography } from "coral-ui/components";

import BanUserMutation from "./BanUserMutation";

import styles from "./UserBanPopoverContainer.css";

interface Props {
  onDismiss: () => void;
  user: UserData;
}

const UserBanPopoverContainer: FunctionComponent<Props> = ({
  user,
  onDismiss,
}) => {
  const banUser = useMutation(BanUserMutation);
  const onBan = useCallback(() => {
    banUser({ userID: user.id });
    onDismiss();
  }, [user, banUser]);
  return (
    <Box className={styles.root} p={3}>
      <Localized id="comments-userBanPopover-title" $username={user.username}>
        <Typography variant="heading3" mb={2}>
          Ban {user.username}?
        </Typography>
      </Localized>
      <Localized id="comments-userBanPopover-description">
        <Typography variant="detail" mb={3}>
          Once banned, this user will no longer be able to comment, use
          reactions, or report comments.
        </Typography>
      </Localized>
      <Flex justifyContent="flex-end" itemGutter="half">
        <Localized id="comments-userBanPopover-cancel">
          <Button variant="outlined" size="small" onClick={onDismiss}>
            Cancel
          </Button>
        </Localized>
        <Localized id="comments-userBanPopover-ban">
          <Button variant="filled" size="small" onClick={onBan}>
            Ban
          </Button>
        </Localized>
      </Flex>
    </Box>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment UserBanPopoverContainer_user on User {
      id
      username
      status {
        current
        ban {
          active
        }
      }
    }
  `,
})(UserBanPopoverContainer);

export default enhanced;
