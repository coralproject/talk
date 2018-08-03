import React, { StatelessComponent } from "react";

import { Button, Flex, Typography } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import * as styles from "./PermalinkView.css";

export interface PermalinkViewProps {
  comment: {} | null;
  assetURL: string | null;
  onShowAllComments: () => void;
}

const PermalinkView: StatelessComponent<PermalinkViewProps> = ({
  assetURL,
  comment,
  onShowAllComments,
}) => {
  return (
    <div className={styles.root}>
      {assetURL && (
        <Button
          variant="outlined"
          color="primary"
          onClick={onShowAllComments}
          className={styles.button}
          fullWidth
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
