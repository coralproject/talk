import React, { FunctionComponent } from "react";

import { useStreamLocal } from "coral-stream/local/StreamLocal";

import PermalinkView from "./PermalinkView";
import Stream from "./Stream";

const CommentsPane: FunctionComponent = () => {
  const { commentID } = useStreamLocal();
  const showPermalinkView = Boolean(commentID);
  if (showPermalinkView) {
    return <PermalinkView />;
  }
  return <Stream />;
};

export default CommentsPane;
