import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  MessageBox,
  MessageBoxContent,
  MessageBoxIcon,
} from "coral-stream/common/MessageBox";

import { MessageBoxContainer_story as StoryData } from "coral-stream/__generated__/MessageBoxContainer_story.graphql";

import styles from "./MessageBoxContainer.css";

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
      <MessageBoxContent
        className={
          story.settings.messageBox.icon ? styles.withIcon : styles.withoutIcon
        }
      >
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
        mode
      }
    }
  `,
})(MessageBoxContainer);

export default enhanced;
