import * as React from "react";
import { StatelessComponent } from "react";

import CommentContainer from "../containers/CommentContainer";

export interface StreamProps {
  comments: ReadonlyArray<{ id: string }>;
}

const Stream: StatelessComponent<StreamProps> = props => {
  return (
    <div>
      {props.comments.map(comment => (
        <CommentContainer key={comment.id} data={comment} gutterBottom />
      ))}
    </div>
  );
};

export default Stream;
