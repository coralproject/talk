import { Localized } from "fluent-react/compat";
import React from "react";
import { graphql } from "react-relay";

import { ModeratedByContainer_comment } from "coral-admin/__generated__/ModeratedByContainer_comment.graphql";
import { ModeratedByContainer_viewer } from "coral-admin/__generated__/ModeratedByContainer_viewer.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";

import styles from "./ModeratedByContainer.css";

interface Props {
  viewer: ModeratedByContainer_viewer;
  comment: ModeratedByContainer_comment;
}

const ModeratedByContainer: React.FunctionComponent<Props> = ({
  comment,
  viewer,
}) => {
  let moderatedBy: React.ReactElement | null;
  if (!comment.statusLiveUpdated || comment.statusHistory.edges.length === 0) {
    moderatedBy = null;
  } else if (comment.statusHistory.edges[0].node.moderator === null) {
    moderatedBy = (
      <Localized id="moderate-comment-moderatedBySystem">System</Localized>
    );
  } else if (viewer.id === comment.statusHistory.edges[0].node.moderator.id) {
    moderatedBy = null;
  } else {
    moderatedBy = <>{comment.statusHistory.edges[0].node.moderator.username}</>;
  }

  if (!moderatedBy) {
    return null;
  }

  return (
    <div>
      <Localized id="moderate-comment-moderatedBy">
        <div className={styles.moderatedBy}>Moderated By</div>
      </Localized>
      <div className={styles.moderatedByUsername}>{moderatedBy}</div>
    </div>
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
