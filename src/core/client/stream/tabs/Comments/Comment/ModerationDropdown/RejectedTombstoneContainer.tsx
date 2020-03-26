import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { CallOut, TextLink } from "coral-ui/components/v2";

import { RejectedTombstoneContainer_comment as CommentData } from "coral-stream/__generated__/RejectedTombstoneContainer_comment.graphql";

import styles from "./RejectedTombstoneContainer.css";

interface Props {
  comment: CommentData;
}

const RejectedTombstoneContainer: FunctionComponent<Props> = ({ comment }) => {
  const Link = useMemo<React.FunctionComponent>(
    () => ({ children }) => (
      <TextLink
        className={cn(
          styles.link,
          CLASSES.rejectedTombstone.goToModerateButton
        )}
        href={`/admin/moderate/comment/${comment.id}`}
        target="_blank"
      >
        {children}
      </TextLink>
    ),
    [comment]
  );
  return (
    <CallOut
      className={cn(styles.root, CLASSES.rejectedTombstone.$root)}
      color="regular"
      fullWidth
    >
      <Localized id="comments-rejectedTombstone" TextLink={<Link />}>
        <span>
          You have rejected this comment.{" "}
          <Link>Go to Moderate to review this decision.</Link>
        </span>
      </Localized>
    </CallOut>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment RejectedTombstoneContainer_comment on Comment {
      id
    }
  `,
})(RejectedTombstoneContainer);

export default enhanced;
