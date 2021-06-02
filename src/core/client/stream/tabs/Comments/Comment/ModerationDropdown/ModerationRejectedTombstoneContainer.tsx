import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button, Tombstone } from "coral-ui/components/v3";

import { ModerationRejectedTombstoneContainer_comment as CommentData } from "coral-stream/__generated__/ModerationRejectedTombstoneContainer_comment.graphql";

import styles from "./ModerationRejectedTombstoneContainer.css";

interface Props {
  comment: CommentData;
}

const ModerationRejectedTombstoneContainer: FunctionComponent<Props> = ({
  comment,
}) => {
  return (
    <Tombstone className={CLASSES.moderationRejectedTombstone.$root} fullWidth>
      <Localized id="comments-moderationRejectedTombstone-title">
        <div>You have rejected this comment.</div>
      </Localized>
      <Button
        variant="flat"
        color="primary"
        underline
        className={CLASSES.moderationRejectedTombstone.goToModerateButton}
        href={`/admin/moderate/comment/${comment.id}`}
        target="_blank"
      >
        <Flex alignItems="center">
          <Localized id="comments-moderationRejectedTombstone-moderateLink">
            <span>Go to moderate to review this decision</span>
          </Localized>
          <Icon size="sm" className={styles.icon}>
            open_in_new
          </Icon>
        </Flex>
      </Button>
    </Tombstone>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerationRejectedTombstoneContainer_comment on Comment {
      id
    }
  `,
})(ModerationRejectedTombstoneContainer);

export default enhanced;
