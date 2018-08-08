import React, { MouseEvent, StatelessComponent } from "react";

import { Button, Flex, Typography } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import * as styles from "./PermalinkView.css";

export interface PermalinkViewProps {
  comment: {} | null;
  showAllCommentsHref: string | null;
  onShowAllComments: (e: MouseEvent<any>) => void;
}

const PermalinkView: StatelessComponent<PermalinkViewProps> = ({
  showAllCommentsHref,
  comment,
  onShowAllComments,
}) => {
  return (
    <div className={styles.root}>
      {showAllCommentsHref && (
        <Button
          id="talk-comments-permalinkView-showAllComments"
          variant="outlined"
          color="primary"
          onClick={onShowAllComments}
          className={styles.button}
          href={showAllCommentsHref}
          target="_parent"
          fullWidth
          anchor
        >
          Show all Comments
        </Button>
      )}
      {!comment && <Typography>Comment not found</Typography>}
      {comment && (
        <Flex direction="column">
          <CommentContainer data={comment} />
        </Flex>
      )}
    </div>
  );
};

export default PermalinkView;
