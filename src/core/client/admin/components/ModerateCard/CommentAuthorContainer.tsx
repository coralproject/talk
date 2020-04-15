import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Tag } from "coral-ui/components/v2";

import { CommentAuthorContainer_comment as CommentData } from "coral-admin/__generated__/CommentAuthorContainer_comment.graphql";

import styles from "./CommentAuthorContainer.css";

interface Props {
  comment: CommentData;
}

const CommentAuthorContainer: FunctionComponent<Props> = ({ comment }) => {
  if (
    !comment.author ||
    !(
      comment.author.status.ban.active ||
      comment.author.status.premod.active ||
      comment.author.status.suspension.active
    )
  ) {
    return null;
  }
  return (
    <>
      {comment.author.status.ban.active && (
        <div className={styles.authorStatus}>
          <Localized id="commentAuthor-status-banned">
            <Tag color="error">BANNED</Tag>
          </Localized>
        </div>
      )}
      {comment.author.status.suspension.active && (
        <div className={styles.authorStatus}>
          <Localized id="commentAuthor-status-suspended">
            <Tag color="error">SUSPENDED</Tag>
          </Localized>
        </div>
      )}
      {comment.author.status.premod.active && (
        <div className={styles.authorStatus}>
          <Localized id="commentAuthor-status-premod">
            <Tag color="grey">PRE-MOD</Tag>
          </Localized>
        </div>
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
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
})(CommentAuthorContainer);

export default enhanced;
