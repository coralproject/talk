import * as React from "react";
import { StatelessComponent } from "react";

import PermalinkViewQuery from "../queries/PermalinkViewQuery";
import StreamQuery from "../queries/StreamQuery";

export interface CommentsPaneProps {
  showPermalinkView: boolean;
}

const CommentsPane: StatelessComponent<CommentsPaneProps> = props => {
  return props.showPermalinkView ? <PermalinkViewQuery /> : <StreamQuery />;
};

export default CommentsPane;
