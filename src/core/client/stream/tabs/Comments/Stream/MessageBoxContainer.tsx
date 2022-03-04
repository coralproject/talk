import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import {
  MessageBox,
  MessageBoxContent,
  MessageBoxIcon,
} from "coral-stream/common/MessageBox";

import { MessageBoxContainer_story$key as StoryData } from "coral-stream/__generated__/MessageBoxContainer_story.graphql";

import styles from "./MessageBoxContainer.css";

interface Props {
  story: StoryData;
  className?: string;
}

const MessageBoxContainer: FunctionComponent<Props> = ({
  story,
  className,
}) => {
  const storyData = useFragment(
    graphql`
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
    story
  );

  return (
    <MessageBox className={className}>
      {storyData.settings.messageBox.icon && (
        <MessageBoxIcon>{storyData.settings.messageBox.icon}</MessageBoxIcon>
      )}
      <MessageBoxContent
        className={
          storyData.settings.messageBox.icon
            ? styles.withIcon
            : styles.withoutIcon
        }
      >
        {storyData.settings.messageBox.content || ""}
      </MessageBoxContent>
    </MessageBox>
  );
};

export default MessageBoxContainer;
