import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Tag } from "coral-ui/components/v2";

import { CommentAuthorContainer_comment as CommentData } from "coral-admin/__generated__/CommentAuthorContainer_comment.graphql";

import styles from "./CommentAuthorContainer.css";

interface Props {
  comment: CommentData;
}

const CommentAuthorContainer: FunctionComponent<Props> = ({ comment }) => {
  if (!comment.author || !comment.author.status.ban.active) {
    return null;
  }
  return (
    <>
      <Localized id="commentAuthor-status-banned">
        <div className={styles.authorStatus}>
          <Tag color="error">BANNED</Tag>
        </div>
      </Localized>
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
          ban {
            active
          }
        }
      }
    }
  `,
})(CommentAuthorContainer);

export default enhanced;
