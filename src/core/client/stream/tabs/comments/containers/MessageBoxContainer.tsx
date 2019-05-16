import { withFragmentContainer } from "coral-framework/lib/relay";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { MessageBoxContainer_story as StoryData } from "coral-stream/__generated__/MessageBoxContainer_story.graphql";
import {
  MessageBox,
  MessageBoxContent,
  MessageBoxIcon,
} from "coral-stream/components/MessageBox";

interface Props {
  story: StoryData;
  className?: string;
}

const MessageBoxContainer: FunctionComponent<Props> = ({
  story,
  className,
}) => {
  return (
    <MessageBox className={className}>
      {story.settings.messageBox.icon && (
        <MessageBoxIcon>{story.settings.messageBox.icon}</MessageBoxIcon>
      )}
      <MessageBoxContent>
        {story.settings.messageBox.content || ""}
      </MessageBoxContent>
    </MessageBox>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment MessageBoxContainer_story on Story {
      settings {
        messageBox {
          content
          icon
        }
      }
    }
  `,
})(MessageBoxContainer);

export default enhanced;
