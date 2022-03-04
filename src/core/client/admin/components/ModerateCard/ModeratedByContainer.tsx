import { Localized } from "@fluent/react/compat";
import React, { useCallback, useMemo } from "react";
import { graphql, useFragment } from "react-relay";

import { BaseButton } from "coral-ui/components/v2";

import { ModeratedByContainer_comment$key as ModeratedByContainer_comment } from "coral-admin/__generated__/ModeratedByContainer_comment.graphql";

import styles from "./ModeratedByContainer.css";

interface Props {
  comment: ModeratedByContainer_comment;
  onUsernameClicked: (id?: string | null) => void;
}

const MODERATION_STATUS = ["APPROVED", "REJECTED"];

interface ModeratedBy {
  id?: string;
  username?: string | null;
  system?: boolean;
  externalModPhases?: string[];
}

const system: ModeratedBy = { system: true };

const ModeratedByContainer: React.FunctionComponent<Props> = ({
  comment,
  onUsernameClicked,
}) => {
  const commentData = useFragment(
    graphql`
      fragment ModeratedByContainer_comment on Comment {
        id
        status
        viewerDidModerate
        statusHistory(first: 1) {
          edges {
            node {
              status
              moderator {
                id
                username
              }
            }
          }
        }
        revision {
          metadata {
            externalModeration {
              name
              result {
                status
              }
            }
          }
        }
      }
    `,
    comment
  );
  const moderatedBy: ModeratedBy | null = useMemo(() => {
    // If the comment was just moderated by the viewer, don't display anything.
    // This will update once the mutation returns.
    if (commentData.viewerDidModerate) {
      return null;
    }

    // If the comment has not been approved or rejected, don't render anything.
    if (!MODERATION_STATUS.includes(commentData.status)) {
      return null;
    }

    if (commentData.statusHistory.edges.length === 0) {
      const externalModPhases = commentData.revision?.metadata?.externalModeration
        ?.filter((m) => m.result.status === commentData.status)
        .map((m: { name: string }) => m.name);
      if (externalModPhases && externalModPhases.length > 0) {
        return {
          externalModPhases,
        };
      }
      return system;
    }

    // Get the node that was the last moderated by element.
    const {
      node: { status, moderator },
    } = commentData.statusHistory.edges[0];
    if (!MODERATION_STATUS.includes(status)) {
      return null;
    }

    if (!moderator) {
      return system;
    }

    return moderator;
  }, [commentData]);

  const onClick = useCallback(() => {
    if (!moderatedBy || !moderatedBy.id) {
      return;
    }
    onUsernameClicked(moderatedBy.id);
  }, [onUsernameClicked, moderatedBy]);

  if (!moderatedBy) {
    return null;
  }

  const ModeratedByNode = (
    <>
      <Localized id="moderate-comment-moderatedBy">
        <div className={styles.moderatedBy}>Moderated By</div>
      </Localized>
      <div className={styles.moderatedByUsername}>
        {moderatedBy.externalModPhases &&
          moderatedBy.externalModPhases.length > 0 &&
          moderatedBy.externalModPhases.join(", ")}
        {moderatedBy.system && (
          <Localized id="moderate-comment-moderatedBySystem">System</Localized>
        )}
        {moderatedBy.username}
      </div>
    </>
  );

  if (!moderatedBy || !moderatedBy.id) {
    return ModeratedByNode;
  }

  return <BaseButton onClick={onClick}>{ModeratedByNode}</BaseButton>;
};

export default ModeratedByContainer;
