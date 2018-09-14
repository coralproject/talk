import { Localized } from "fluent-react/compat";
import React, { MouseEvent, StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, Typography } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import * as styles from "./PermalinkView.css";

export interface PermalinkViewProps {
  me: PropTypesOf<typeof CommentContainer>["me"];
  asset: PropTypesOf<typeof CommentContainer>["asset"];
  comment: PropTypesOf<typeof CommentContainer>["comment"] | null;
  showAllCommentsHref: string | null;
  onShowAllComments: (e: MouseEvent<any>) => void;
}

const PermalinkView: StatelessComponent<PermalinkViewProps> = ({
  showAllCommentsHref,
  comment,
  asset,
  onShowAllComments,
  me,
}) => {
  return (
    <div className={styles.root}>
      {showAllCommentsHref && (
        <Localized id="comments-permalinkView-showAllComments">
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
        </Localized>
      )}
      {!comment && (
        <Localized id="comments-permalinkView-commentNotFound">
          <Typography>Comment not found</Typography>
        </Localized>
      )}
      {comment && <CommentContainer me={me} comment={comment} asset={asset} />}
    </div>
  );
};

export default PermalinkView;
