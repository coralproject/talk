import * as React from "react";
import { StatelessComponent } from "react";

import { Center } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import PostCommentFormContainer from "../containers/PostCommentFormContainer";
import Logo from "./Logo";

export interface AppProps {
  comments: ReadonlyArray<{ id: string }>;
}

const App: StatelessComponent<AppProps> = props => {
  return (
    <Center>
      <Logo gutterBottom />
      {props.comments.map(comment => (
        <CommentContainer key={comment.id} data={comment} gutterBottom />
      ))}
      <PostCommentFormContainer />
    </Center>
  );
};

export default App;
