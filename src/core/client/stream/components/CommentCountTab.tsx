import { Localized } from "fluent-react/compat";
import React, { Component } from "react";
import { Tab } from "talk-ui/components";
import { PropTypesOf } from "talk-ui/types";

interface CommentCountTabProps extends PropTypesOf<typeof Tab> {
  commentCount: number;
}

class CommentCountTab extends Component<CommentCountTabProps> {
  public render() {
    const { commentCount, ...props } = this.props;
    return (
      <Localized id="general-app-commentsTab" $commentCount={commentCount}>
        <Tab {...props}>{"{$commentCount} Comments"}</Tab>
      </Localized>
    );
  }
}

export default CommentCountTab;
