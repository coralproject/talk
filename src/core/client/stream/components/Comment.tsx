import React from "react";
import { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

import CommentTimestamp from "./CommentTimestamp";
import CommentTopBar from "./CommentTopBar";
import Username from "./Username";

export interface CommentProps {
  author: {
    username: string;
  } | null;
  body: string | null;
  createdAt: string;
}

const Comment: StatelessComponent<CommentProps> = props => {
  return (
    <div role="article">
      <CommentTopBar>
        {props.author && <Username>{props.author.username}</Username>}
        <CommentTimestamp>{props.createdAt}</CommentTimestamp>
      </CommentTopBar>
      <Typography>{props.body}</Typography>
    </div>
  );
};

export default Comment;
