import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";
import { LiveStreamContainer_settings } from "coral-stream/__generated__/LiveStreamContainer_settings.graphql";
import { LiveStreamContainer_viewer } from "coral-stream/__generated__/LiveStreamContainer_viewer.graphql";

import LiveCommentContainer from "./LiveComment";

interface Props {
  comments: LiveCommentContainer_comment[];
  viewer: LiveStreamContainer_viewer | null;
  settings: LiveStreamContainer_settings;
}

const LiveStream: FunctionComponent<Props> = ({
  comments,
  viewer,
  settings,
}) => {
  return (
    <>
      {comments.map((c) => (
        <div key={c.id}>
          <LiveCommentContainer
            comment={c}
            viewer={viewer}
            settings={settings}
          />
        </div>
      ))}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LiveStreamContainer_viewer on User {
      ...LiveCommentContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveStreamContainer_settings on Settings {
      ...LiveCommentContainer_settings
    }
  `,
})(LiveStream);

export default enhanced;
