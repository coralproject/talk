import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button, HorizontalGutter } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import Indent from "./Indent";

export interface ReplyListProps {
  asset: PropTypesOf<typeof CommentContainer>["asset"];
  me: PropTypesOf<typeof CommentContainer>["me"];
  comment: {
    id: string;
  };
  comments: ReadonlyArray<
    { id: string } & PropTypesOf<typeof CommentContainer>["comment"]
  >;
  onShowAll: () => void;
  hasMore: boolean;
  disableShowAll: boolean;
  indentLevel?: number;
}

const ReplyList: StatelessComponent<ReplyListProps> = props => {
  return (
    <HorizontalGutter
      id={`talk-comments-replyList-log--${props.comment.id}`}
      role="log"
    >
      {props.comments.map(comment => (
        <CommentContainer
          key={comment.id}
          me={props.me}
          comment={comment}
          asset={props.asset}
          indentLevel={props.indentLevel}
        />
      ))}
      {props.hasMore && (
        <Indent level={props.indentLevel} noBorder>
          <Localized id="comments-replyList-showAll">
            <Button
              id={`talk-comments-replyList-showAll--${props.comment.id}`}
              aria-controls={`talk-comments-replyList-log--${props.comment.id}`}
              onClick={props.onShowAll}
              disabled={props.disableShowAll}
              variant="outlined"
              fullWidth
            >
              Show All Replies
            </Button>
          </Localized>
        </Indent>
      )}
    </HorizontalGutter>
  );
};

export default ReplyList;
