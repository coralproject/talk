import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { CallOut, TextLink } from "coral-ui/components";

import { RejectedTombstoneContainer_comment as CommentData } from "coral-stream/__generated__/RejectedTombstoneContainer_comment.graphql";

interface Props {
  comment: CommentData;
}

const RejectedTombstoneContainer: FunctionComponent<Props> = ({ comment }) => {
  const Link = useMemo<React.FunctionComponent>(
    () => ({ children }) => (
      <TextLink
        className={CLASSES.rejectedTombstone.goToModerateButton}
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
      className={CLASSES.rejectedTombstone.$root}
      color="primary"
      fullWidth
    >
      <Localized id="comments-rejectedTombstone" TextLink={<Link />}>
        <div>
          You have rejected this comment.{" "}
          <Link>Go to Moderate to review this decision.</Link>
        </div>
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
