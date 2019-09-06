import { Localized } from "fluent-react/compat";
import React, { useCallback } from "react";
import { graphql } from "react-relay";

import { ModeratedByContainer_comment } from "coral-admin/__generated__/ModeratedByContainer_comment.graphql";
import { ModeratedByContainer_viewer } from "coral-admin/__generated__/ModeratedByContainer_viewer.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { BaseButton } from "coral-ui/components";

import styles from "./ModeratedByContainer.css";

interface Props {
  viewer: ModeratedByContainer_viewer;
  comment: ModeratedByContainer_comment;
  onUsernameClicked: (id?: string | null) => void;
}

const ModeratedByContainer: React.FunctionComponent<Props> = ({
  comment,
  viewer,
  onUsernameClicked,
}) => {
  let moderatedBy: React.ReactElement | null;
  let id: string | null = null;
  if (comment.statusHistory.edges.length === 0) {
    moderatedBy = null;
  } else if (comment.statusHistory.edges[0].node.moderator === null) {
    moderatedBy = (
      <Localized id="moderate-comment-moderatedBySystem">System</Localized>
    );
  } else if (viewer.id === comment.statusHistory.edges[0].node.moderator.id) {
    moderatedBy = null;
  } else {
    moderatedBy = <>{comment.statusHistory.edges[0].node.moderator.username}</>;
    id = comment.statusHistory.edges[0].node.moderator.id;
  }

  if (!moderatedBy) {
    return null;
  }

  const onClick = useCallback(() => {
    onUsernameClicked(id);
  }, [onUsernameClicked, comment]);

  return (
    <BaseButton onClick={onClick}>
      <Localized id="moderate-comment-moderatedBy">
        <div className={styles.moderatedBy}>Moderated By</div>
      </Localized>
      <div className={styles.moderatedByUsername}>{moderatedBy}</div>
    </BaseButton>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModeratedByContainer_comment on Comment {
      id
      statusLiveUpdated
      statusHistory(first: 1) {
        edges {
          node {
            moderator {
              id
              username
            }
          }
        }
      }
    }
  `,
  viewer: graphql`
    fragment ModeratedByContainer_viewer on User {
      id
    }
  `,
})(ModeratedByContainer);

export default enhanced;
