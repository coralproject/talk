import * as React from "react";
import { StatelessComponent } from "react";

import StreamQuery from "../queries/StreamQuery";
import PermalinkView from "../views/permalink";

export interface CommentsPaneProps {
  showPermalinkView: boolean;
}

const CommentsPane: StatelessComponent<CommentsPaneProps> = props => {
  return props.showPermalinkView ? <PermalinkView /> : <StreamQuery />;
};

export default CommentsPane;
