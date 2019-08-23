import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { UserBanPopoverContainer_comment } from "coral-stream/__generated__/UserBanPopoverContainer_comment.graphql";
import { Box, Button, Flex, Typography } from "coral-ui/components";

import RejectCommentMutation from "../ModerationDropdown/RejectCommentMutation";
import BanUserMutation from "./BanUserMutation";

import styles from "./UserBanPopoverContainer.css";

interface Props {
  onDismiss: () => void;
  comment: UserBanPopoverContainer_comment;
}

const UserBanPopoverContainer: FunctionComponent<Props> = ({
  comment,
  onDismiss,
}) => {
  const user = comment.author!;
  const rejected = comment.status === "REJECTED";
  const reject = useMutation(RejectCommentMutation);
  const banUser = useMutation(BanUserMutation);
  const { localeBundles } = useCoralContext();

  const onBan = useCallback(() => {
    banUser({
      userID: user.id,
      message: getMessage(
        localeBundles,
        "common-banEmailTemplate",
        "Someone with access to your account has violated our community guidelines. As a result, your account has been banned. You will no longer be able to comment, react or report comments",
        { username: user.username }
      ),
    });
    if (!rejected && comment.revision) {
      reject({ commentID: comment.id, commentRevisionID: comment.revision.id });
    }
    onDismiss();
  }, [user, banUser, onDismiss, localeBundles]);
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
  comment: graphql`
    fragment UserBanPopoverContainer_comment on Comment {
      id
      revision {
        id
      }
      status
      author {
        id
        username
      }
    }
  `,
})(UserBanPopoverContainer);

export default enhanced;
