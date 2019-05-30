import * as React from "react";
import { FunctionComponent } from "react";

import PermalinkView from "./PermalinkView";
import Stream from "./Stream";

export interface CommentsPaneProps {
  showPermalinkView: boolean;
}

const CommentsPane: FunctionComponent<CommentsPaneProps> = props => {
  return props.showPermalinkView ? <PermalinkView /> : <Stream />;
};

export default CommentsPane;
