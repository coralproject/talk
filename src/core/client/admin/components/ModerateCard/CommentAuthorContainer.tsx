import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { CommentAuthorContainer_comment as CommentData } from "coral-admin/__generated__/CommentAuthorContainer_comment.graphql";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_STATUS } from "coral-framework/schema";
import { Tag } from "coral-ui/components";

import styles from "./CommentAuthorContainer.css";

interface Props {
  comment: CommentData;
}

const CommentAuthorContainer: FunctionComponent<Props> = ({ comment }) => {
  return (
    <>
      {comment.author &&
        comment.author.status &&
        comment.author.status.current.includes(GQLUSER_STATUS.BANNED) && (
          <Localized id="commentAuthor-status-banned">
            <div className={styles.authorStatus}>
              <Tag color="error">BANNED</Tag>
            </div>
          </Localized>
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
          current
        }
      }
    }
  `,
})(CommentAuthorContainer);

export default enhanced;
