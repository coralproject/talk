import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { Tag } from "coral-ui/components/v2";

import { CommentAuthorContainer_comment$key as CommentData } from "coral-admin/__generated__/CommentAuthorContainer_comment.graphql";

import styles from "./CommentAuthorContainer.css";

interface Props {
  comment: CommentData;
}

const CommentAuthorContainer: FunctionComponent<Props> = ({ comment }) => {
  const commentData = useFragment(
    graphql`
      fragment CommentAuthorContainer_comment on Comment {
        author {
          id
          username
          status {
            suspension {
              active
            }
            premod {
              active
            }
            ban {
              active
            }
          }
        }
      }
    `,
    comment
  );

  if (
    !commentData.author ||
    !(
      commentData.author.status.ban.active ||
      commentData.author.status.premod.active ||
      commentData.author.status.suspension.active
    )
  ) {
    return null;
  }
  return (
    <>
      {commentData.author.status.ban.active && (
        <div className={styles.authorStatus}>
          <Localized id="commentAuthor-status-banned">
            <Tag color="error">BANNED</Tag>
          </Localized>
        </div>
      )}
      {commentData.author.status.suspension.active && (
        <div className={styles.authorStatus}>
          <Localized id="commentAuthor-status-suspended">
            <Tag color="error">SUSPENDED</Tag>
          </Localized>
        </div>
      )}
      {commentData.author.status.premod.active && (
        <div className={styles.authorStatus}>
          <Localized id="commentAuthor-status-premod">
            <Tag color="grey">PRE-MOD</Tag>
          </Localized>
        </div>
      )}
    </>
  );
};

export default CommentAuthorContainer;
