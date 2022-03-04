import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { useMutation } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Box, Button, Flex } from "coral-ui/components/v2";

import { UserBanPopoverContainer_comment$key as UserBanPopoverContainer_comment } from "coral-stream/__generated__/UserBanPopoverContainer_comment.graphql";
import { UserBanPopoverContainer_story$key as UserBanPopoverContainer_story } from "coral-stream/__generated__/UserBanPopoverContainer_story.graphql";

import RejectCommentMutation from "../ModerationDropdown/RejectCommentMutation";
import BanUserMutation from "./BanUserMutation";

import styles from "./UserBanPopoverContainer.css";

interface Props {
  onDismiss: () => void;
  comment: UserBanPopoverContainer_comment;
  story: UserBanPopoverContainer_story;
}

const UserBanPopoverContainer: FunctionComponent<Props> = ({
  comment,
  story,
  onDismiss,
}) => {
  const commentData = useFragment(
    graphql`
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
    comment
  );
  const storyData = useFragment(
    graphql`
      fragment UserBanPopoverContainer_story on Story {
        id
        site {
          id
          name
        }
      }
    `,
    story
  );

  const user = commentData.author!;
  const rejected = commentData.status === "REJECTED";
  const reject = useMutation(RejectCommentMutation);
  const banUser = useMutation(BanUserMutation);
  const { localeBundles } = useCoralContext();

  const onBan = useCallback(() => {
    void banUser({
      userID: user.id,
      commentID: commentData.id,
      rejectExistingComments: false,
      message: getMessage(
        localeBundles,
        "common-banEmailTemplate",
        "Someone with access to your account has violated our community guidelines. As a result, your account has been banned. You will no longer be able to comment, react or report comments",
        { username: user.username }
      ),
      siteIDs: [],
    });

    if (!rejected && commentData.revision) {
      void reject({
        commentID: commentData.id,
        commentRevisionID: commentData.revision.id,
        storyID: storyData.id,
        noEmit: true,
      });
    }
    onDismiss();
  }, [
    banUser,
    user.id,
    user.username,
    commentData.id,
    commentData.revision,
    localeBundles,
    rejected,
    onDismiss,
    reject,
    storyData.id,
  ]);

  return (
    <Box className={cn(styles.root, CLASSES.banUserPopover.$root)} p={3}>
      <Localized id="comments-userBanPopover-title" $username={user.username}>
        <div className={styles.title}>Ban {user.username}?</div>
      </Localized>
      <Localized id="comments-userBanPopover-description">
        <span className={styles.description}>
          Once banned, this user will no longer be able to comment, use
          reactions, or report comments.
        </span>
      </Localized>
      <Flex
        justifyContent="flex-end"
        itemGutter="half"
        className={styles.actions}
      >
        <Localized id="comments-userBanPopover-cancel">
          <Button
            className={CLASSES.banUserPopover.cancelButton}
            variant="outlined"
            size="regular"
            color="mono"
            onClick={onDismiss}
          >
            Cancel
          </Button>
        </Localized>
        <Localized id="comments-userBanPopover-ban">
          <Button
            className={CLASSES.banUserPopover.banButton}
            variant="regular"
            size="regular"
            color="alert"
            onClick={onBan}
          >
            Ban
          </Button>
        </Localized>
      </Flex>
    </Box>
  );
};

export default UserBanPopoverContainer;
