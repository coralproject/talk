import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { SlackChannelContainer_slackChannel } from "coral-admin/__generated__/SlackChannelContainer_slackChannel.graphql";

interface Props {
  disabled: boolean;
  channel: SlackChannelContainer_slackChannel;
}

const SlackChannelContainer: FunctionComponent<Props> = ({
  disabled,
  channel,
}) => {
  const { enabled, hookURL, triggers } = channel;

  if (!triggers) {
    return null;
  }

  return (
    <div>
      <div>Enabled: {enabled ? "True" : "False"}</div>
      <div>URL: {hookURL}</div>
      <div>All: {triggers.allComments ? "True" : "False"}</div>
      <div>Reported: {triggers.reportedComments ? "True" : "False"}</div>
      <div>Pending: {triggers.pendingComments ? "True" : "False"}</div>
      <div>Featured: {triggers.featuredComments ? "True" : "False"}</div>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  channel: graphql`
    fragment SlackChannelContainer_slackChannel on SlackChannel {
      enabled
      hookURL
      triggers {
        allComments
        reportedComments
        pendingComments
        featuredComments
      }
    }
  `,
})(SlackChannelContainer);

export default enhanced;
